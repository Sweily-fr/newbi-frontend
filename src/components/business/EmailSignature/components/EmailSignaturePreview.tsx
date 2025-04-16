import React from 'react';
import { EmailSignature } from './EmailSignaturesTable';

interface EmailSignaturePreviewProps {
  signature: Partial<EmailSignature>;
}

export const EmailSignaturePreview: React.FC<EmailSignaturePreviewProps> = ({ signature }) => {
  // URL de base de l'API pour les images - essayer différentes façons d'accéder aux variables d'environnement
  const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || "http://localhost:4000";
  
  console.log('API URL from env:', apiUrl);
  console.log('All env variables:', import.meta.env);
  console.log('Logo URL original:', signature.logoUrl);

  // Fonction pour préfixer l'URL du logo avec l'URL de l'API si nécessaire
  const getFullLogoUrl = (logoPath: string | undefined) => {
    if (!logoPath) {
      console.log('Logo path is empty');
      return '';
    }
    
    // Vérifier si l'URL est déjà complète
    if (logoPath.startsWith('http')) {
      console.log('Logo URL already starts with http:', logoPath);
      return logoPath;
    }
    
    // Vérifier si l'URL contient déjà l'URL de l'API (pour éviter les doubles préfixes)
    if (logoPath.includes(apiUrl)) {
      console.log('Logo URL already contains API URL:', logoPath);
      return logoPath;
    }
    
    // Pour le débogage, utiliser une image de test en ligne si nous avons un chemin relatif
    // Cela nous permettra de vérifier si le problème vient des variables d'environnement
    if (!logoPath.startsWith('http')) {
      console.log('Using placeholder image for testing');
      return 'https://via.placeholder.com/150';
    }
    
    // Ajouter le préfixe de l'API
    const fullUrl = `${apiUrl}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
    console.log('Full logo URL with prefix:', fullUrl);
    return fullUrl;
  };
  
  // Déstructuration avec valeurs par défaut
  const {
    fullName,
    jobTitle,
    email,
    phone,
    mobilePhone,
    website,
    address,
    companyName,
    socialLinks,
    template,
    primaryColor,
    secondaryColor,
    logoUrl,
    showLogo
  } = signature;
  
  // Définir explicitement showLogo avec une valeur par défaut à true
  const displayLogo = showLogo !== false; // Si showLogo est undefined ou null, on affiche le logo
  
  console.log('showLogo value:', showLogo);
  console.log('displayLogo calculated:', displayLogo);

  // Fonction pour rendre le template de signature approprié
  const renderSignatureTemplate = () => {
    switch (template) {
      case 'PROFESSIONAL':
        return renderProfessionalTemplate();
      case 'MODERN':
        return renderModernTemplate();
      case 'CREATIVE':
        return renderCreativeTemplate();
      case 'SIMPLE':
      default:
        return renderSimpleTemplate();
    }
  };

  // Template Simple
  const renderSimpleTemplate = () => {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#333' }}>
        <div style={{ marginBottom: '10px' }}>
          {logoUrl && displayLogo && (
            <div style={{ marginBottom: '10px' }}>
              <img 
                src={getFullLogoUrl(logoUrl)} 
                alt="Logo" 
                style={{ maxWidth: '100px' }} 
                onError={(e) => {
                  console.error('Error loading logo image:', e);
                  console.log('Failed URL:', e.currentTarget.src);
                }}
              />
            </div>
          )}
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{fullName || 'Votre Nom'}</div>
          <div style={{ color: primaryColor || '#0066cc' }}>{jobTitle || 'Votre Poste'}</div>
          {companyName && <div>{companyName}</div>}
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          {email && <div>Email: <a href={`mailto:${email}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }}>{email}</a></div>}
          {phone && <div>Tél: {phone}</div>}
          {mobilePhone && <div>Mobile: {mobilePhone}</div>}
          {website && <div>Site web: <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{website}</a></div>}
          {address && <div>Adresse: {address}</div>}
        </div>
        
        {socialLinks && Object.values(socialLinks).some(link => link) && (
          <div style={{ marginTop: '10px' }}>
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">Twitter</a>
            )}
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">Facebook</a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} style={{ color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">Instagram</a>
            )}
          </div>
        )}
      </div>
    );
  };

  // Template Professionnel
  const renderProfessionalTemplate = () => {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#333', borderLeft: `4px solid ${primaryColor || '#0066cc'}`, paddingLeft: '15px' }}>
        <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '150px', paddingRight: '20px' }}>
                {logoUrl && displayLogo && (
                  <>
                    <img 
                      src={getFullLogoUrl(logoUrl)} 
                      alt="Logo" 
                      style={{ maxWidth: '150px', marginBottom: '10px' }} 
                      onError={(e) => {
                        console.error('Error loading logo image (Professional):', e);
                        console.log('Failed URL:', e.currentTarget.src);
                      }}
                    />
                    {/* Affichage de débogage de l'URL */}
                    <div style={{ fontSize: '10px', color: '#999', marginTop: '5px', wordBreak: 'break-all' }}>
                      URL: {getFullLogoUrl(logoUrl)}
                    </div>
                  </>
                )}
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{fullName || 'Votre Nom'}</div>
                <div style={{ color: primaryColor || '#0066cc', marginBottom: '5px' }}>{jobTitle || 'Votre Poste'}</div>
                {companyName && <div style={{ marginBottom: '10px' }}>{companyName}</div>}
              </td>
              <td style={{ verticalAlign: 'top', borderLeft: `1px solid ${secondaryColor || '#f5f5f5'}`, paddingLeft: '20px' }}>
                {email && <div style={{ marginBottom: '5px' }}>Email: <a href={`mailto:${email}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }}>{email}</a></div>}
                {phone && <div style={{ marginBottom: '5px' }}>Tél: {phone}</div>}
                {mobilePhone && <div style={{ marginBottom: '5px' }}>Mobile: {mobilePhone}</div>}
                {website && <div style={{ marginBottom: '5px' }}>Site web: <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{website}</a></div>}
                {address && <div style={{ marginBottom: '5px' }}>Adresse: {address}</div>}
                
                {socialLinks && Object.values(socialLinks).some(link => link) && (
                  <div style={{ marginTop: '10px' }}>
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    )}
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">Twitter</a>
                    )}
                    {socialLinks.facebook && (
                      <a href={socialLinks.facebook} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">Facebook</a>
                    )}
                    {socialLinks.instagram && (
                      <a href={socialLinks.instagram} style={{ color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">Instagram</a>
                    )}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Template Moderne
  const renderModernTemplate = () => {
    return (
      <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px', color: '#333', backgroundColor: secondaryColor || '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '15px' }}>
          {logoUrl && displayLogo && (
            <>
              <img 
                src={getFullLogoUrl(logoUrl)} 
                alt="Logo" 
                style={{ maxWidth: '80px', marginRight: '15px' }} 
                onError={(e) => {
                  console.error('Error loading logo image (Modern):', e);
                  console.log('Failed URL:', e.currentTarget.src);
                }}
              />
              {/* Affichage de débogage de l'URL */}
              <div style={{ fontSize: '10px', color: '#999', marginTop: '5px', wordBreak: 'break-all' }}>
                URL: {getFullLogoUrl(logoUrl)}
              </div>
            </>
          )}
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: primaryColor || '#0066cc' }}>{fullName || 'Votre Nom'}</div>
            <div style={{ fontSize: '15px' }}>{jobTitle || 'Votre Poste'}</div>
            {companyName && <div>{companyName}</div>}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
          {email && (
            <div style={{ backgroundColor: 'white', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <a href={`mailto:${email}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }}>{email}</a>
            </div>
          )}
          {phone && (
            <div style={{ backgroundColor: 'white', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {phone}
            </div>
          )}
          {mobilePhone && (
            <div style={{ backgroundColor: 'white', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {mobilePhone}
            </div>
          )}
          {website && (
            <div style={{ backgroundColor: 'white', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{website}</a>
            </div>
          )}
        </div>
        
        {address && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Adresse:</div>
            <div>{address}</div>
          </div>
        )}
        
        {socialLinks && Object.values(socialLinks).some(link => link) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} style={{ color: primaryColor || '#0066cc', backgroundColor: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">Li</a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} style={{ color: primaryColor || '#0066cc', backgroundColor: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">Tw</a>
            )}
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} style={{ color: primaryColor || '#0066cc', backgroundColor: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">Fb</a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} style={{ color: primaryColor || '#0066cc', backgroundColor: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold' }} target="_blank" rel="noopener noreferrer">Ig</a>
            )}
          </div>
        )}
      </div>
    );
  };

  // Template Créatif
  const renderCreativeTemplate = () => {
    return (
      <div style={{ fontFamily: 'Verdana, Geneva, sans-serif', fontSize: '14px', color: '#333', position: 'relative', padding: '30px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {/* Fond avec dégradé */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: `linear-gradient(135deg, ${primaryColor || '#0066cc'} 0%, ${secondaryColor || '#f5f5f5'} 100%)` }}></div>
        
        {/* Contenu */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo et nom */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            {logoUrl && displayLogo && (
              <div style={{ marginRight: '15px', background: 'white', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <img 
                  src={getFullLogoUrl(logoUrl)} 
                  alt="Logo" 
                  style={{ maxWidth: '80px', maxHeight: '80px' }} 
                  onError={(e) => {
                    console.error('Error loading logo image (Creative):', e);
                    console.log('Failed URL:', e.currentTarget.src);
                  }}
                />
                {/* Affichage de débogage de l'URL */}
                <div style={{ fontSize: '10px', color: '#999', marginTop: '5px', wordBreak: 'break-all' }}>
                  URL: {getFullLogoUrl(logoUrl)}
                </div>
              </div>
            )}
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: primaryColor || '#0066cc' }}>{fullName || 'Votre Nom'}</div>
            <div style={{ fontSize: '16px', marginBottom: '5px' }}>{jobTitle || 'Votre Poste'}</div>
            {companyName && <div style={{ fontStyle: 'italic' }}>{companyName}</div>}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
            {email && (
              <a href={`mailto:${email}`} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', display: 'inline-block' }}>{email}</a>
            )}
            {phone && (
              <div style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', padding: '8px 15px', borderRadius: '5px', display: 'inline-block' }}>{phone}</div>
            )}
            {website && (
              <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', display: 'inline-block' }} target="_blank" rel="noopener noreferrer">{website}</a>
            )}
          </div>
          
          {address && (
            <div style={{ textAlign: 'center', marginBottom: '15px', padding: '10px', border: `1px dashed ${primaryColor || '#0066cc'}`, borderRadius: '5px' }}>
              {address}
            </div>
          )}
          
          {socialLinks && Object.values(socialLinks).some(link => link) && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} target="_blank" rel="noopener noreferrer">Li</a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} target="_blank" rel="noopener noreferrer">Tw</a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} target="_blank" rel="noopener noreferrer">Fb</a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} style={{ color: 'white', backgroundColor: primaryColor || '#0066cc', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} target="_blank" rel="noopener noreferrer">Ig</a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-medium">Aperçu de la signature</h2>
      </div>
      <div className="flex-grow bg-gray-50 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-md">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Exemple d'email</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="mb-4">Bonjour,</p>
              <p className="mb-4">Je vous remercie pour votre message. Nous avons bien pris en compte votre demande et nous reviendrons vers vous dans les plus brefs délais.</p>
              <p className="mb-4">Cordialement,</p>
              <div className="mt-6 border-t pt-4 border-gray-200">
                {renderSignatureTemplate()}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Signature seule</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {renderSignatureTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
