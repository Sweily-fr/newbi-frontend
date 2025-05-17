// Script pour aider à déboguer le problème du textarea
// Exécutez ce script dans la console du navigateur quand vous êtes sur la page du formulaire

// Cette fonction force le textarea à rester vide lorsque vous le videz manuellement
function fixTextarea() {
  const textarea = document.getElementById('headerNotes');
  if (textarea) {
    // Sauvegarder la référence à l'événement onChange d'origine
    const originalOnChange = textarea.onchange;
    
    // Ajouter un écouteur d'événement pour l'entrée utilisateur
    textarea.addEventListener('input', function(e) {
      // Si le champ est vide, forcer une chaîne vide
      if (!this.value || this.value.trim() === '') {
        this.value = '';
        
        // Déclencher un événement de changement pour mettre à jour React
        const event = new Event('change', { bubbles: true });
        this.dispatchEvent(event);
      }
    });
    
    console.log('Correction du textarea appliquée avec succès!');
  } else {
    console.log('Textarea #headerNotes non trouvé. Assurez-vous d\'être sur la bonne page.');
  }
}

// Exécuter la fonction après le chargement de la page
window.addEventListener('load', fixTextarea);

// Vous pouvez également l'exécuter manuellement dans la console
console.log('Pour appliquer la correction manuellement, exécutez fixTextarea()');
