import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { SEOHead } from '../components/specific/SEO/SEOHead';

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
    <div className="bg-[#f0eeff]/30 min-h-screen py-12">
      <SEOHead 
        title="Contact | Newbi"
        description="Contactez l'équipe de Newbi pour toute question, suggestion ou besoin d'assistance. Notre équipe est là pour vous aider."
        keywords="contact, support, aide, assistance, question, message, Newbi"
        schemaType="ContactPage"
        additionalSchemaData={{
          'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'customer service',
            'email': 'contact@newbi.fr'
          }
        }}
        ogImage="https://newbi.fr/images/PNG/Logo_Texte_Purple.png"
        canonicalUrl="https://newbi.fr/contact"
      />
      
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-lg">
          {/* Partie gauche */}
          <div className="w-full md:w-5/12 bg-gradient-to-br from-[#6e64ff] to-[#5b50ff]/90 p-10 text-white">
            <h2 className="text-2xl font-light uppercase tracking-wider mb-2">CONTACTEZ-NOUS</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Parlons de votre projet</h1>
            
            <div className="space-y-8 mt-12">
              <div className="flex items-start">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Email</p>
                  <a href="mailto:contact@newbi.fr" className="text-white hover:text-white/80">contact@newbi.fr</a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Téléphone</p>
                  <p className="text-white">02 21 85 02 40</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Adresse</p>
                  <p className="text-white">229 rue Saint-Honoré<br />75001 Paris, France</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Horaires</p>
                  <p className="text-white">Du lundi au vendredi, de 9h à 18h</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Partie droite */}
          <div className="w-full md:w-7/12 p-10">
            {submitSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-[#f0eeff] rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                  <svg className="h-10 w-10 text-[#5b50ff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Message envoyé avec succès !</h3>
                <p className="text-gray-600 mb-8 max-w-md">
                  Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-[#5b50ff] text-white py-3 px-6 rounded-full hover:bg-[#4a41e0] transition-colors font-medium"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#1e1a4a] mb-8">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b50ff] ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b50ff] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b50ff] ${errors.subject ? 'border-red-500' : 'border-gray-300'} bg-white`}
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
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b50ff] ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Votre message"
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                  </div>
                  
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {submitError}
                    </div>
                  )}
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-[#5b50ff] text-white py-3 px-6 rounded-full hover:bg-[#4a41e0] transition-colors font-medium flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Envoi en cours...' : (
                        <>
                          Envoyer
                          <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
