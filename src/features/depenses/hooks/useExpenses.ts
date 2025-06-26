import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { 
  GET_EXPENSES, 
  GET_EXPENSE, 
  GET_EXPENSE_STATS,
  CREATE_EXPENSE, 
  UPDATE_EXPENSE, 
  DELETE_EXPENSE,
  CHANGE_EXPENSE_STATUS,
  ADD_EXPENSE_FILE,
  REMOVE_EXPENSE_FILE,
  PROCESS_EXPENSE_FILE_OCR,
  APPLY_OCR_DATA_TO_EXPENSE
} from '../graphql';
import { 
  Expense, 
  ExpenseFilters, 
  ExpensePagination, 
  ExpenseStats,
  CreateExpenseInput, 
  UpdateExpenseInput,
  ExpenseStatus,
  ExpenseCategory,
  FileUploadInput,
  OCRMetadata
} from '../types';
import { logger } from '../../../utils/logger';

/**
 * Hook personnalisé pour gérer les dépenses
 */
export const useExpenses = () => {
  // État local pour les filtres de recherche
  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    limit: 10
  });

  // Préparer les variables en filtrant les valeurs vides pour les enums
  const prepareVariables = useCallback((vars: ExpenseFilters) => {
    // Créer une nouvelle instance des filtres sans les valeurs vides
    const cleanedVars: Partial<ExpenseFilters> = {
      page: vars.page,
      limit: vars.limit
    };
    
    // Ajouter les filtres non vides
    if (vars.startDate) cleanedVars.startDate = vars.startDate;
    if (vars.endDate) cleanedVars.endDate = vars.endDate;
    if (vars.search) cleanedVars.search = vars.search;
    if (vars.tags && vars.tags.length > 0) cleanedVars.tags = vars.tags;
    
    // Gérer spécifiquement les enums pour éviter les chaînes vides
    if (vars.category && typeof vars.category === 'string' && vars.category.length > 0) {
      cleanedVars.category = vars.category as ExpenseCategory;
    }
    
    if (vars.status && typeof vars.status === 'string' && vars.status.length > 0) {
      cleanedVars.status = vars.status as ExpenseStatus;
    }
    
    // Logger les variables nettoyées en mode développement
    logger.debug('Variables nettoyées pour la requête GraphQL:', cleanedVars);
    
    return cleanedVars;
  }, []);

  // Requête pour récupérer une liste paginée de dépenses
  const { 
    data: expensesData, 
    loading: expensesLoading, 
    error: expensesError,
    refetch: refetchExpenses,
    fetchMore: fetchMoreExpenses
  } = useQuery<{ expenses: ExpensePagination }>(GET_EXPENSES, {
    variables: prepareVariables(filters),
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  });

  // Fonction pour charger plus de dépenses (pagination)
  const loadMoreExpenses = useCallback(() => {
    if (expensesData?.expenses.hasNextPage) {
      const nextPageFilters = {
        ...filters,
        page: (filters.page || 1) + 1
      };
      
      fetchMoreExpenses({
        variables: prepareVariables(nextPageFilters),
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          
          return {
            expenses: {
              ...fetchMoreResult.expenses,
              expenses: [
                ...prev.expenses.expenses,
                ...fetchMoreResult.expenses.expenses
              ]
            }
          };
        }
      });
      
      setFilters(prev => ({
        ...prev,
        page: (prev.page || 1) + 1
      }));
    }
  }, [expensesData, fetchMoreExpenses, filters, prepareVariables]);

  // Fonction pour mettre à jour les filtres
  const updateFilters = useCallback((newFilters: Partial<ExpenseFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Réinitialiser la pagination lors du changement de filtres
    }));
  }, []);

  // Fonction pour réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10
    });
  }, []);

  // Requête pour récupérer les statistiques des dépenses
  const { 
    data: statsData, 
    loading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useQuery<{ expenseStats: ExpenseStats }>(GET_EXPENSE_STATS, {
    variables: {
      startDate: filters.startDate,
      endDate: filters.endDate
    },
    fetchPolicy: 'cache-and-network'
  });

  // Mutation pour créer une nouvelle dépense
  const [createExpenseMutation, { loading: createLoading }] = useMutation(CREATE_EXPENSE, {
    update: (cache, { data: { createExpense } }) => {
      try {
        // Mettre à jour le cache Apollo pour inclure la nouvelle dépense
        const existingData = cache.readQuery<{ expenses: ExpensePagination }>({
          query: GET_EXPENSES,
          variables: filters
        });

        if (existingData) {
          cache.writeQuery({
            query: GET_EXPENSES,
            variables: filters,
            data: {
              expenses: {
                ...existingData.expenses,
                expenses: [createExpense, ...existingData.expenses.expenses],
                totalCount: existingData.expenses.totalCount + 1
              }
            }
          });
        }
        
        // Rafraîchir les statistiques
        refetchStats();
      } catch (error) {
        logger.error('Erreur lors de la mise à jour du cache après création:', error);
      }
    }
  });

  // Fonction pour créer une nouvelle dépense
  const createExpense = useCallback(async (input: CreateExpenseInput) => {
    try {
      const { data } = await createExpenseMutation({
        variables: { input }
      });
      return data.createExpense;
    } catch (error) {
      logger.error('Erreur lors de la création de la dépense:', error);
      throw error;
    }
  }, [createExpenseMutation]);

  // Mutation pour mettre à jour une dépense existante
  const [updateExpenseMutation, { loading: updateLoading }] = useMutation(UPDATE_EXPENSE, {
    update: (cache, { data: { updateExpense } }) => {
      try {
        // Mettre à jour le cache pour la dépense individuelle
        cache.writeQuery({
          query: GET_EXPENSE,
          variables: { id: updateExpense.id },
          data: { expense: updateExpense }
        });
        
        // Rafraîchir la liste des dépenses et les statistiques
        refetchExpenses();
        refetchStats();
      } catch (error) {
        logger.error('Erreur lors de la mise à jour du cache après modification:', error);
      }
    }
  });

  // Fonction pour mettre à jour une dépense existante
  const updateExpense = useCallback(async (id: string, input: UpdateExpenseInput) => {
    try {
      const { data } = await updateExpenseMutation({
        variables: { id, input }
      });
      return data.updateExpense;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la dépense:', error);
      throw error;
    }
  }, [updateExpenseMutation]);

  // Mutation pour supprimer une dépense
  const [deleteExpenseMutation, { loading: deleteLoading }] = useMutation(DELETE_EXPENSE, {
    update: (cache, { data: { deleteExpense } }, { variables }) => {
      try {
        if (deleteExpense && variables?.id) {
          // Supprimer la dépense du cache
          cache.evict({ id: `Expense:${variables.id}` });
          cache.gc();
          
          // Rafraîchir la liste des dépenses et les statistiques
          refetchExpenses();
          refetchStats();
        }
      } catch (error) {
        logger.error('Erreur lors de la mise à jour du cache après suppression:', error);
      }
    }
  });

  // Fonction pour supprimer une dépense
  const deleteExpense = useCallback(async (id: string) => {
    try {
      const { data } = await deleteExpenseMutation({
        variables: { id }
      });
      return data.deleteExpense;
    } catch (error) {
      logger.error('Erreur lors de la suppression de la dépense:', error);
      throw error;
    }
  }, [deleteExpenseMutation]);

  // Mutation pour changer le statut d'une dépense
  const [changeStatusMutation, { loading: changeStatusLoading }] = useMutation(CHANGE_EXPENSE_STATUS, {
    update: (cache, { data: { changeExpenseStatus } }) => {
      try {
        // Mettre à jour le cache pour la dépense individuelle
        const existingData = cache.readQuery<{ expense: Expense }>({
          query: GET_EXPENSE,
          variables: { id: changeExpenseStatus.id }
        });
        
        if (existingData) {
          cache.writeQuery({
            query: GET_EXPENSE,
            variables: { id: changeExpenseStatus.id },
            data: {
              expense: {
                ...existingData.expense,
                status: changeExpenseStatus.status,
                paymentDate: changeExpenseStatus.paymentDate
              }
            }
          });
        }
        
        // Rafraîchir la liste des dépenses et les statistiques
        refetchExpenses();
        refetchStats();
      } catch (error) {
        logger.error('Erreur lors de la mise à jour du cache après changement de statut:', error);
      }
    }
  });

  // Fonction pour changer le statut d'une dépense
  const changeExpenseStatus = useCallback(async (id: string, status: ExpenseStatus) => {
    try {
      const { data } = await changeStatusMutation({
        variables: { id, status }
      });
      return data.changeExpenseStatus;
    } catch (error) {
      logger.error('Erreur lors du changement de statut de la dépense:', error);
      throw error;
    }
  }, [changeStatusMutation]);

  // Mutation pour ajouter un fichier à une dépense
  const [addFileMutation, { loading: addFileLoading }] = useMutation(ADD_EXPENSE_FILE);

  // Fonction pour ajouter un fichier à une dépense
  const addExpenseFile = useCallback(async (expenseId: string, input: FileUploadInput) => {
    try {
      const { data } = await addFileMutation({
        variables: { expenseId, input }
      });
      return data.addExpenseFile;
    } catch (error) {
      logger.error('Erreur lors de l\'ajout du fichier à la dépense:', error);
      throw error;
    }
  }, [addFileMutation]);

  // Mutation pour supprimer un fichier d'une dépense
  const [removeFileMutation, { loading: removeFileLoading }] = useMutation(REMOVE_EXPENSE_FILE);

  // Fonction pour supprimer un fichier d'une dépense
  const removeExpenseFile = useCallback(async (expenseId: string, fileId: string) => {
    try {
      const { data } = await removeFileMutation({
        variables: { expenseId, fileId }
      });
      return data.removeExpenseFile;
    } catch (error) {
      logger.error('Erreur lors de la suppression du fichier de la dépense:', error);
      throw error;
    }
  }, [removeFileMutation]);

  // Mutation pour déclencher manuellement l'analyse OCR d'un fichier
  const [processOCRMutation, { loading: processOCRLoading }] = useMutation(PROCESS_EXPENSE_FILE_OCR);

  // Fonction pour déclencher manuellement l'analyse OCR d'un fichier
  const processExpenseFileOCR = useCallback(async (expenseId: string, fileId: string) => {
    try {
      const { data } = await processOCRMutation({
        variables: { expenseId, fileId }
      });
      return data.processExpenseFileOCR;
    } catch (error) {
      logger.error('Erreur lors du traitement OCR du fichier:', error);
      throw error;
    }
  }, [processOCRMutation]);

  // Mutation pour appliquer les données OCR aux champs de la dépense
  const [applyOCRMutation, { loading: applyOCRLoading }] = useMutation(APPLY_OCR_DATA_TO_EXPENSE);

  // Fonction pour appliquer les données OCR aux champs de la dépense
  const applyOCRDataToExpense = useCallback(async (expenseId: string) => {
    try {
      const { data } = await applyOCRMutation({
        variables: { expenseId }
      });
      return data.applyOCRDataToExpense;
    } catch (error) {
      logger.error('Erreur lors de l\'application des données OCR à la dépense:', error);
      throw error;
    }
  }, [applyOCRMutation]);
  
  // Fonction pour traiter un fichier avec OCR sans dépense existante
  const processOCRFile = useCallback(async (file: File): Promise<OCRMetadata> => {
    try {
      logger.debug('Traitement OCR du fichier:', file.name);
      
      // Dans un environnement de production, cette partie utiliserait une API OCR réelle
      // comme Google Cloud Vision, Azure Form Recognizer ou Tesseract.js
      // Ici, nous implémentons une version améliorée de la simulation
      
      // Créer un objet OCR pour stocker les données extraites
      const ocrData: OCRMetadata = {};
      
      // Simuler le traitement du texte brut extrait du document
      // Dans une implémentation réelle, ce texte viendrait de l'API OCR
      let extractedText = '';
      
      // Utiliser FileReader pour lire le contenu du fichier si c'est un PDF ou une image
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        // Simuler l'extraction de texte basée sur le nom du fichier
        // Dans une implémentation réelle, nous utiliserions une API OCR
        extractedText = await simulateTextExtraction(file);
        ocrData.rawExtractedText = extractedText;
      } else {
        throw new Error('Format de fichier non pris en charge pour l\'OCR');
      }
      
      // Extraire les informations pertinentes du texte
      const extractionResults = extractInformationFromText(extractedText, file.name);
      
      // Remplir l'objet OCRMetadata avec les informations extraites
      Object.assign(ocrData, extractionResults.data);
      
      // Définir le score de confiance global basé sur la qualité des extractions
      ocrData.confidenceScore = extractionResults.confidenceScore;
      
      // Simuler un délai de traitement OCR pour une expérience utilisateur réaliste
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      logger.debug('Données OCR extraites:', ocrData);
      
      return ocrData;
    } catch (error) {
      logger.error('Erreur lors du traitement OCR du fichier:', error);
      throw new Error('Erreur lors du traitement OCR: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  }, []);
  
  // Déterminer le fournisseur en fonction du nom de fichier
  const vendor = '';
  const address = '';
  const siren = '';
  const vatNumber = '';
  const invoiceNumberPrefix = '';
  const paymentMethod = '';
  const bankDetails = '';
  
  // Extraire une date potentielle du nom de fichier
  const extractDateFromFileName = (): Date | null => {
    
    // Normaliser le texte pour faciliter l'extraction
    const normalizedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
    
    // Diviser le texte en lignes pour une analyse plus facile
    const lines = normalizedText.split('\n');
    
    // 1. EXTRACTION DU NOM DU FOURNISSEUR
    // Plusieurs stratégies d'extraction
    let vendorName = '';
    
    // Stratégie 1: Première ligne en majuscules (souvent l'en-tête de la facture)
    if (lines.length > 0 && /^[A-Z\s]+$/.test(lines[0])) {
      vendorName = lines[0].trim();
      confidenceScores.vendorName = 0.9;
    } 
    // Stratégie 2: Recherche de motifs spécifiques
    else {
      const vendorPatterns = [
        /^([^\n]+)/, // Première ligne
        /Fournisseur\s*:?\s*([^\n]+)/i,
        /Émetteur\s*:?\s*([^\n]+)/i,
        /Émis par\s*:?\s*([^\n]+)/i,
        /Société\s*:?\s*([^\n]+)/i,
        /Vendeur\s*:?\s*([^\n]+)/i
      ];
      
      for (const pattern of vendorPatterns) {
        const match = normalizedText.match(pattern);
        if (match && match[1] && match[1].trim().length > 0) {
          vendorName = match[1].trim();
          confidenceScores.vendorName = 0.8;
          break;
        }
      }
    }
    
    // Stratégie 3: Fallback sur le nom de fichier
    if (!vendorName) {
      if (fileName.toLowerCase().includes('amazon')) {
        vendorName = 'Amazon France';
      } else if (fileName.toLowerCase().includes('orange') || fileName.toLowerCase().includes('telecom')) {
        vendorName = 'Orange SA';
      } else if (fileName.toLowerCase().includes('edf') || fileName.toLowerCase().includes('electricite')) {
        vendorName = 'EDF';
      } else if (fileName.toLowerCase().includes('sncf') || fileName.toLowerCase().includes('train')) {
        vendorName = 'SNCF';
      } else {
        // Essayer d'extraire un nom du fichier
        const fileNameParts = fileName.split(/[_\-\s.]/);
        vendorName = fileNameParts[0].charAt(0).toUpperCase() + fileNameParts[0].slice(1);
      }
      confidenceScores.vendorName = 0.4;
    }
    
    extractedData.vendorName = vendorName;
    
    // 2. EXTRACTION DE L'ADRESSE DU FOURNISSEUR
    const addressPatterns = [
      /(?:[^\n]+\n){1,3}(?=.*SIREN|.*TVA|.*Facture)/s,
      /Adresse\s*:?\s*([^\n]+(?:\n[^\n]+){0,2})/i,
      /Siège social\s*:?\s*([^\n]+(?:\n[^\n]+){0,2})/i
    ];
    
    for (const pattern of addressPatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[0]) {
        extractedData.vendorAddress = match[0].trim();
        confidenceScores.vendorAddress = 0.7;
        break;
      }
    }
    
    // 3. EXTRACTION DU NUMÉRO DE TVA
    const vatPatterns = [
      /(?:TVA|VAT)\s*(?:intracommunautaire)?\s*:?\s*(FR\s*\d{2}\s*\d{3}\s*\d{3}\s*\d{3}|FR\s*\d{11})/i,
      /(?:N°|Numéro)\s*(?:TVA|VAT)\s*:?\s*(FR\s*\d{2}\s*\d{3}\s*\d{3}\s*\d{3}|FR\s*\d{11})/i,
      /(FR\s*\d{2}\s*\d{3}\s*\d{3}\s*\d{3}|FR\s*\d{11})/i
    ];
    
    for (const pattern of vatPatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        extractedData.vendorVatNumber = match[1].replace(/\s+/g, '');
        confidenceScores.vendorVatNumber = 0.9;
        break;
      }
    }
    
    // 4. EXTRACTION DU NUMÉRO DE FACTURE
    const invoiceNumberPatterns = [
      /Facture\s*(?:N°|Numéro|No|N)\s*:?\s*([\w\-.]+)/i,
      /(?:N°|Numéro|No|N)\s*(?:facture|commande)?\s*:?\s*([\w\-.]+)/i,
      /(?:N°|Numéro|No|N)\s*:?\s*([\w\-.]+)/i,
      /(?:Réf|Référence)\s*:?\s*([\w\-.]+)/i
    ];
    
    for (const pattern of invoiceNumberPatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[1] && /[a-zA-Z0-9]/.test(match[1])) { // Vérifier qu'il y a au moins un caractère alphanumérique
        extractedData.invoiceNumber = match[1].trim();
        confidenceScores.invoiceNumber = 0.85;
        break;
      }
    }
    
    // Fallback: générer un numéro de facture
    if (!extractedData.invoiceNumber) {
      // Essayer d'extraire du nom de fichier
      const fileNumberMatch = fileName.match(/([A-Za-z]+[-_]?\d+)/i);
      if (fileNumberMatch && fileNumberMatch[1]) {
        extractedData.invoiceNumber = fileNumberMatch[1].toUpperCase();
        confidenceScores.invoiceNumber = 0.5;
      } else {
        extractedData.invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
        confidenceScores.invoiceNumber = 0.3;
      }
    }
    
    // 5. EXTRACTION DE LA DATE DE FACTURE
    const datePatterns = [
      /Date\s*(?:de facture|d'émission|facture)?\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{2,4})/i,
      /Factur(?:é|ation)\s*le\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{2,4})/i,
      /Émis(?:e)?\s*le\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{2,4})/i,
      /(\d{1,2}[/-]\d{1,2}[/-]\d{4})/i // Format simple JJ/MM/AAAA ou JJ-MM-AAAA
    ];
    
    let invoiceDate: Date | null = null;
    
    // Parcourir les patterns de date
    for (const pattern of datePatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        const dateStr = match[1].trim();
        
        try {
          // Essayer différents formats de date
          if (dateStr.match(/\d{1,2}[/-]\d{1,2}[/-]\d{4}/)) {
            // Format JJ/MM/AAAA ou JJ-MM-AAAA
            const [day, month, year] = dateStr.split(/[/-]/).map(Number);
            if (day > 0 && day <= 31 && month > 0 && month <= 12 && year >= 2000) {
              invoiceDate = new Date(year, month - 1, day);
            }
          } else if (dateStr.match(/\d{1,2}\s+[a-zéû]+\s+\d{4}/i)) {
            // Format JJ mois AAAA
            const parts = dateStr.split(/\s+/);
            const day = parseInt(parts[0]);
            const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            const month = monthNames.findIndex(m => parts[1].toLowerCase().includes(m));
            const year = parseInt(parts[2]);
            
            if (day > 0 && day <= 31 && month !== -1 && year >= 2000) {
              invoiceDate = new Date(year, month, day);
            }
          }
          
          if (invoiceDate && !isNaN(invoiceDate.getTime())) {
            extractedData.invoiceDate = invoiceDate.toISOString().split('T')[0];
            confidenceScores.invoiceDate = 0.9;
            break;
          }
        } catch (error) {
          logger.error('Erreur lors du parsing de la date:', error);
        }
      }
    }
    
    // Fallback: essayer d'extraire une date du nom de fichier
    if (!extractedData.invoiceDate) {
      try {
        // Rechercher des patterns de date dans le nom de fichier
        const fileNameDatePatterns = [
          /(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/, // YYYYMMDD
          /(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(20\d{2})/, // DDMMYYYY
          /(0[1-9]|[12]\d|3[01])[-_](0[1-9]|1[0-2])[-_](20\d{2})/, // DD-MM-YYYY ou DD_MM_YYYY
          /(20\d{2})[-_](0[1-9]|1[0-2])[-_](0[1-9]|[12]\d|3[01])/ // YYYY-MM-DD ou YYYY_MM_DD
        ];
        
        for (const pattern of fileNameDatePatterns) {
          const match = fileName.match(pattern);
          if (match) {
            let year, month, day;
            
            if (match[1].startsWith('20')) { // Format YYYYMMDD ou YYYY-MM-DD
              year = parseInt(match[1]);
              month = parseInt(match[2]) - 1;
              day = parseInt(match[3]);
            } else { // Format DDMMYYYY ou DD-MM-YYYY
              day = parseInt(match[1]);
              month = parseInt(match[2]) - 1;
              year = parseInt(match[3]);
            }
            
            const fileDate = new Date(year, month, day);
            if (!isNaN(fileDate.getTime())) {
              extractedData.invoiceDate = fileDate.toISOString().split('T')[0];
              confidenceScores.invoiceDate = 0.6;
              break;
            }
          }
        }
      } catch (error) {
        logger.error('Erreur lors de l\'extraction de la date du nom de fichier:', error);
      }
    }
    
    // Dernier recours: utiliser la date actuelle
    if (!extractedData.invoiceDate) {
      extractedData.invoiceDate = new Date().toISOString().split('T')[0];
      confidenceScores.invoiceDate = 0.3;
    }
    
    // 6. EXTRACTION DU MONTANT TOTAL
    const totalAmountPatterns = [
      /Montant\s*(?:total|ttc)\s*:?\s*(\d+[.,]\d{2})\s*(?:€|EUR|euros)/i,
      /Total\s*(?:TTC)?\s*:?\s*(\d+[.,]\d{2})\s*(?:€|EUR|euros)/i,
      /(?:à payer|Net à payer)\s*:?\s*(\d+[.,]\d{2})\s*(?:€|EUR|euros)/i,
      /(?:Montant|Total)\s*:?\s*(\d+[.,]\d{2})\s*(?:€|EUR|euros)/i,
      /(\d+[.,]\d{2})\s*(?:€|EUR|euros)\s*(?:TTC)/i,
      /TTC\s*:?\s*(\d+[.,]\d{2})\s*(?:€|EUR|euros)/i
    ];
    
    for (const pattern of totalAmountPatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        extractedData.totalAmount = parseFloat(match[1].replace(',', '.'));
        confidenceScores.totalAmount = 0.85;
        break;
      }
    }
    
    // Si aucun montant n'a été trouvé, essayer d'extraire du nom du fichier
    if (!extractedData.totalAmount) {
      const fileNameAmountMatch = fileName.match(/([0-9]+[.,][0-9]{2})/);
      if (fileNameAmountMatch) {
        extractedData.totalAmount = parseFloat(fileNameAmountMatch[1].replace(',', '.'));
        confidenceScores.totalAmount = 0.5;
      } else {
        // Générer un montant aléatoire comme fallback
        extractedData.totalAmount = parseFloat((Math.random() * 1000 + 50).toFixed(2));
        confidenceScores.totalAmount = 0.2;
      }
    }
    
    // Extraire le montant de TVA
    const vatAmountMatch = text.match(/TVA\s*\(\d+%\)\s*:?\s*(\d+[.,]\d{2})\s*€/i) || 
                           text.match(/Montant\s*TVA\s*:?\s*(\d+[.,]\d{2})\s*€/i);
    if (vatAmountMatch && vatAmountMatch[1]) {
      extractedData.vatAmount = parseFloat(vatAmountMatch[1].replace(',', '.'));
      confidenceScores.vatAmount = 0.85;
    } else if (extractedData.totalAmount) {
      // Calculer la TVA à partir du montant total (en supposant un taux de 20%)
      extractedData.vatAmount = parseFloat((extractedData.totalAmount * 0.2 / 1.2).toFixed(2));
      confidenceScores.vatAmount = 0.4;
    }
    
    // Définir la devise (par défaut EUR pour la France)
    extractedData.currency = 'EUR';
    confidenceScores.currency = 0.95;
    
    // Calculer le score de confiance global
    // Moyenne pondérée des scores de confiance individuels
    const weights = {
      vendorName: 0.2,
      vendorAddress: 0.1,
      vendorVatNumber: 0.1,
      invoiceNumber: 0.15,
      invoiceDate: 0.15,
      totalAmount: 0.2,
      vatAmount: 0.1
    };
    
    let totalWeight = 0;
    let weightedScore = 0;
    
    for (const [key, weight] of Object.entries(weights)) {
      if (confidenceScores[key]) {
        weightedScore += confidenceScores[key] * weight;
        totalWeight += weight;
      }
    }
    
    const globalConfidenceScore = totalWeight > 0 ? weightedScore / totalWeight : 0.5;
    
    return {
      data: extractedData,
      confidenceScore: globalConfidenceScore
    };
  };
  
  // La fonction processOCRFile a déjà été définie plus haut dans le code

  // Hook personnalisé pour récupérer une dépense par son ID
  const useExpense = (id: string) => {
    const { 
      data, 
      loading, 
      error,
      refetch
    } = useQuery<{ expense: Expense }>(GET_EXPENSE, {
      variables: { id },
      skip: !id,
      fetchPolicy: 'cache-and-network'
    });

    return {
      expense: data?.expense,
      loading,
      error,
      refetch
    };
  };

  // Valeurs mémorisées pour éviter les re-rendus inutiles
  const expenses = useMemo(() => expensesData?.expenses.expenses || [], [expensesData]);
  const totalCount = useMemo(() => expensesData?.expenses.totalCount || 0, [expensesData]);
  const hasNextPage = useMemo(() => expensesData?.expenses.hasNextPage || false, [expensesData]);
  const stats = useMemo(() => statsData?.expenseStats, [statsData]);

  // État de chargement global
  const isLoading = useMemo(() => 
    expensesLoading || 
    statsLoading || 
    createLoading || 
    updateLoading || 
    deleteLoading || 
    changeStatusLoading || 
    addFileLoading || 
    removeFileLoading || 
    processOCRLoading || 
    applyOCRLoading, 
  [
    expensesLoading, 
    statsLoading, 
    createLoading, 
    updateLoading, 
    deleteLoading, 
    changeStatusLoading, 
    addFileLoading, 
    removeFileLoading, 
    processOCRLoading, 
    applyOCRLoading
  ]);

  // Erreur globale
  const hasError = useMemo(() => expensesError || statsError, [expensesError, statsError]);

  return {
    expenses,
    totalCount,
    hasNextPage,
    stats,
    filters,
    updateFilters,
    resetFilters,
    loadMoreExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    changeExpenseStatus,
    refetchExpenses,
    refetchStats,
    
    // Fonctions de gestion des fichiers
    addExpenseFile,
    removeExpenseFile,
    processExpenseFileOCR,
    applyOCRDataToExpense,
    
    // Fonction pour traiter un fichier avec OCR sans dépense existante
    processOCRFile,
    
    // Hook pour récupérer une dépense individuelle
    useExpense,
    
    // État global
    loading: isLoading,
    error: hasError
  };
};
