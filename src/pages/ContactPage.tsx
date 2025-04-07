import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { gql, useMutation } from '@apollo/client';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer un email valide';
      valid = false;
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
      valid = false;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Définition de la mutation GraphQL pour envoyer un message de contact
  const SEND_CONTACT_MESSAGE = gql`
    mutation SendContactMessage($input: ContactInput!) {
      sendContactMessage(input: $input) {
        success
        message
      }
    }
  `;

  // Hook useMutation pour exécuter la mutation
  const [sendContactMessage] = useMutation(SEND_CONTACT_MESSAGE, {
    onCompleted: (data) => {
      if (data.sendContactMessage.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitError(data.sendContactMessage.message || 'Une erreur est survenue lors de l\'envoi du message.');
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Erreur lors de l\'envoi du message:', error);
      setSubmitError('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Envoi du message via la mutation GraphQL
      await sendContactMessage({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
          }
        }
      });
    } catch (error) {
      // L'erreur est déjà gérée par onError du useMutation
      console.error('Erreur non gérée:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Contact | Génération Business</title>
        <meta name="description" content="Contactez l'équipe de Génération Business pour toute question ou demande d'assistance." />
      </Helmet>
      
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Contactez-nous</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 mb-6">
              Vous avez des questions, des suggestions ou besoin d'assistance ? N'hésitez pas à nous contacter. 
              Notre équipe est là pour vous aider et vous répondra dans les plus brefs délais.
            </p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Informations de contact</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">
                    <strong className="block text-gray-700">Email :</strong>
                    <a href="mailto:contact@generation-business.fr" className="text-blue-600 hover:underline">contact@generation-business.fr</a>
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">
                    <strong className="block text-gray-700">Téléphone :</strong>
                    +33 1 23 45 67 89
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">
                    <strong className="block text-gray-700">Adresse :</strong>
                    123 Avenue des Entrepreneurs<br />
                    75001 Paris, France
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Horaires d'ouverture</h2>
              <p className="text-gray-600">
                Du lundi au vendredi, de 9h à 18h
              </p>
            </div>
          </div>
          
          <div>
            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
                <svg className="h-12 w-12 text-green-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Message envoyé avec succès !</h3>
                <p className="text-green-700 mb-4">
                  Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Votre nom"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Votre email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="question">Question générale</option>
                    <option value="support">Support technique</option>
                    <option value="billing">Facturation</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Votre message"
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>
                
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {submitError}
                  </div>
                )}
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
