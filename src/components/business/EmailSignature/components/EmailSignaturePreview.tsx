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

  // Fonction pour préfixer l'URL du logo ou de la photo de profil avec l'URL de l'API si nécessaire
  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) {
      return '';
    }
    
    // Vérifier si l'URL est déjà complète
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Vérifier si l'URL contient déjà l'URL de l'API (pour éviter les doubles préfixes)
    if (imagePath.includes(apiUrl)) {
      return imagePath;
    }
    
    // Pour le débogage, utiliser une image de test en ligne si nous avons un chemin relatif
    // Cela nous permettra de vérifier si le problème vient des variables d'environnement
    if (!imagePath.startsWith('http')) {
      // Utiliser l'image réelle avec le préfixe de l'API
      const fullUrl = `${apiUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
      return fullUrl;
    }
    
    return imagePath;
  };
  
  // Fonction spécifique pour l'URL du logo
  const getFullLogoUrl = (logoPath: string | undefined) => {
    return getFullImageUrl(logoPath);
  };
  
  // Fonction spécifique pour l'URL de la photo de profil
  const getFullProfilePhotoUrl = (photoPath: string | undefined) => {
    // Si c'est une image en base64 (prévisualisation), la retourner directement
    if (photoPath && photoPath.startsWith('data:image')) {
      return photoPath;
    }
    // Sinon, utiliser la fonction standard pour les URLs
    return getFullImageUrl(photoPath);
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
    showLogo,
    profilePhotoUrl,
    profilePhotoSize,
    socialLinksDisplayMode,
    socialLinksIconStyle,
    socialLinksIconBgColor,
    socialLinksIconColor,
    layout,
    fontFamily,
    fontSize
  } = signature;
  
  // Définir explicitement showLogo avec une valeur par défaut à true
  const displayLogo = showLogo !== false; // Si showLogo est undefined ou null, on affiche le logo
  
  // Définir la taille de la photo de profil avec une valeur par défaut
  const photoSize = profilePhotoSize || 80; // Taille par défaut: 80px
  
  // Définir la police de caractères avec une valeur par défaut
  const signatureFontFamily = fontFamily || 'Arial, sans-serif'; // Police par défaut: Arial
  
  // Définir la taille de police avec une valeur par défaut
  const signatureFontSize = fontSize || 14; // Taille par défaut: 14px
  
  // Log pour déboguer
  console.log('Police sélectionnée:', fontFamily);
  console.log('Police utilisée:', signatureFontFamily);
  console.log('Taille de police sélectionnée:', fontSize);
  console.log('Taille de police utilisée:', signatureFontSize);
  
  // Style de base pour la signature
  const baseStyle = {
    fontFamily: signatureFontFamily,
    fontSize: `${signatureFontSize}px`,
    color: '#333'
  };
  
  // Définir le mode d'affichage des réseaux sociaux avec une valeur par défaut
  const displayMode = socialLinksDisplayMode || 'text'; // Mode par défaut: texte
  
  // Définir la disposition de la signature avec une valeur par défaut
  const signatureLayout = layout || 'vertical'; // Disposition par défaut: verticale
  
  // Définir l'espacement horizontal entre les colonnes avec une valeur par défaut
  const horizontalSpacing = signature.horizontalSpacing !== undefined ? signature.horizontalSpacing : 20; // Espacement par défaut: 20px
  
  // Définir le style des icônes des réseaux sociaux avec une valeur par défaut
  const iconStyle = socialLinksIconStyle || 'plain'; // Style par défaut: sans fond
  
  // Définir les couleurs des icônes des réseaux sociaux avec des valeurs par défaut
  const iconBgColor = socialLinksIconBgColor || primaryColor; // Couleur de fond par défaut: couleur primaire
  const iconColor = socialLinksIconColor || (iconStyle === 'plain' ? primaryColor : '#FFFFFF'); // Couleur du texte par défaut
  
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
    // Si la disposition est verticale, on utilise la mise en page originale
    if (signatureLayout === 'vertical') {
      return (
        <div style={baseStyle}>
          <div style={{ 
            marginBottom: '10px', 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '15px',
            flexDirection: 'column'
          }}>
            {profilePhotoUrl && (
              <div>
                <img 
                  src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                  alt="Photo de profil" 
                  style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: '50%', objectFit: 'cover' }} 
                  onError={(e) => {
                    console.error('Error loading profile photo:', e);
                  }}
                />
              </div>
            )}
            <div>
              {logoUrl && displayLogo && (
                <div style={{ marginBottom: '10px' }}>
                  <img 
                    src={getFullLogoUrl(logoUrl)} 
                    alt="Logo" 
                    style={{ maxWidth: '100px' }} 
                    onError={(e) => {
                      console.error('Error loading logo image:', e);
                    }}
                  />
                </div>
              )}
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{fullName || 'Votre Nom'}</div>
              <div style={{ color: primaryColor || '#0066cc' }}>{jobTitle || 'Votre Poste'}</div>
              {companyName && <div>{companyName}</div>}
            </div>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            {email && <div>Email: <a href={`mailto:${email}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }}>{email}</a></div>}
            {phone && <div>Tél: {phone}</div>}
            {mobilePhone && <div>Mobile: {mobilePhone}</div>}
            {website && <div>Site web: <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{website}</a></div>}
            {address && <div>Adresse: {address}</div>}
          </div>
        </div>
      );
    }
    
    // Si la disposition est horizontale, on utilise la nouvelle mise en page
    // Déterminer si nous avons des images à afficher (photo de profil et/ou logo)
    const hasProfilePhoto = !!profilePhotoUrl;
    const hasLogo = !!(logoUrl && displayLogo);
    const hasAnyImage = hasProfilePhoto || hasLogo;
    
    // Ajuster l'espacement en fonction de la présence d'images
    const effectiveSpacing = hasAnyImage ? horizontalSpacing : Math.max(5, horizontalSpacing / 2);
    
    return (
      <div style={baseStyle}>
        <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr>
              {/* Colonne de gauche: photos et informations personnelles */}
              <td style={{ verticalAlign: 'top', width: 'auto', paddingRight: `${effectiveSpacing}px` }}>
                {/* Photos alignées horizontalement */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: hasAnyImage ? '10px' : '0' }}>
                  {profilePhotoUrl && (
                    <div style={{ width: `${photoSize}px`, height: `${photoSize}px` }}>
                      <img 
                        src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                        alt="Photo de profil" 
                        style={{ width: `100%`, height: `100%`, borderRadius: '50%', objectFit: 'cover' }} 
                        onError={(e) => {
                          console.error('Error loading profile photo:', e);
                        }}
                      />
                    </div>
                  )}
                  {logoUrl && displayLogo && (
                    <div>
                      <img 
                        src={getFullLogoUrl(logoUrl)} 
                        alt="Logo" 
                        style={{ maxWidth: '100px' }} 
                        onError={(e) => {
                          console.error('Error loading logo image:', e);
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Nom, poste et entreprise en dessous des photos */}
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{fullName || 'Votre Nom'}</div>
                  <div style={{ color: primaryColor || '#0066cc' }}>{jobTitle || 'Votre Poste'}</div>
                  {companyName && <div>{companyName}</div>}
                </div>
              </td>
              
              {/* Colonne de droite: informations de contact */}
              <td style={{ verticalAlign: 'top', width: 'auto', paddingLeft: `${effectiveSpacing}px`, borderLeft: `1px solid ${secondaryColor || '#f5f5f5'}` }}>
                {email && <div style={{ marginBottom: '5px' }}>Email: <a href={`mailto:${email}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }}>{email}</a></div>}
                {phone && <div style={{ marginBottom: '5px' }}>Tél: {phone}</div>}
                {mobilePhone && <div style={{ marginBottom: '5px' }}>Mobile: {mobilePhone}</div>}
                {website && <div style={{ marginBottom: '5px' }}>Site web: <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: primaryColor || '#0066cc', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">{website}</a></div>}
                {address && <div style={{ marginBottom: '5px' }}>Adresse: {address}</div>}
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Réseaux sociaux en bas */}
        {socialLinks && Object.values(socialLinks).some(link => link) && (
          <div style={{ 
            marginTop: '15px', 
            paddingTop: '10px', 
            borderTop: `1px solid ${secondaryColor || '#f5f5f5'}`,
            textAlign: 'left'
          }}>
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                {displayMode === 'icons' ? (
                  <span style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    textAlign: 'center',
                    lineHeight: '24px',
                    backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                    color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                    borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                  }}>in</span>
                ) : 'LinkedIn'}
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                {displayMode === 'icons' ? (
                  <span style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    textAlign: 'center',
                    lineHeight: '24px',
                    backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                    color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                    borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                  }}>tw</span>
                ) : 'Twitter'}
              </a>
            )}
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} style={{ marginRight: '10px', color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                {displayMode === 'icons' ? (
                  <span style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    textAlign: 'center',
                    lineHeight: '24px',
                    backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                    color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                    borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                  }}>fb</span>
                ) : 'Facebook'}
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} style={{ color: primaryColor || '#0066cc' }} target="_blank" rel="noopener noreferrer">
                {displayMode === 'icons' ? (
                  <span style={{
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    textAlign: 'center',
                    lineHeight: '24px',
                    backgroundColor: iconStyle !== 'plain' ? (iconBgColor || primaryColor || '#0066cc') : 'transparent',
                    color: iconStyle !== 'plain' ? (iconColor || 'white') : (iconColor || primaryColor || '#0066cc'),
                    borderRadius: iconStyle === 'circle' ? '50%' : (iconStyle === 'rounded' ? '4px' : '0')
                  }}>ig</span>
                ) : 'Instagram'}
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  // Template Professionnel
  const renderProfessionalTemplate = () => {
    // Si la disposition est horizontale, on utilise une table avec une seule ligne et deux colonnes
    // Si la disposition est verticale, on utilise une table avec deux lignes et une colonne
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#333', borderLeft: `4px solid ${primaryColor || '#0066cc'}`, paddingLeft: '15px' }}>
        <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {signatureLayout === 'horizontal' ? (
              <tr>
                <td style={{ verticalAlign: 'top', width: '150px', paddingRight: '20px' }}>
                {profilePhotoUrl && (
                  <div style={{ marginBottom: '15px' }}>
                    <img 
                      src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                      alt="Photo de profil" 
                      style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} 
                      onError={(e) => {
                        console.error('Error loading profile photo:', e);
                      }}
                    />
                  </div>
                )}
                {logoUrl && displayLogo && (
                  <div style={{ marginBottom: '15px' }}>
                    <img 
                      src={getFullLogoUrl(logoUrl)} 
                      alt="Logo" 
                      style={{ maxWidth: '150px' }} 
                      onError={(e) => {
                        console.error('Error loading logo image (Professional):', e);
                        console.log('Failed URL:', e.currentTarget.src);
                      }}
                    />
                  </div>
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
            ) : (
            <>
              <tr>
                <td style={{ verticalAlign: 'top', paddingBottom: '20px' }}>
                  {profilePhotoUrl && (
                    <div style={{ marginBottom: '15px' }}>
                      <img 
                        src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                        alt="Photo de profil" 
                        style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} 
                        onError={(e) => {
                          console.error('Error loading profile photo:', e);
                        }}
                      />
                    </div>
                  )}
                  {logoUrl && displayLogo && (
                    <div style={{ marginBottom: '15px' }}>
                      <img 
                        src={getFullLogoUrl(logoUrl)} 
                        alt="Logo" 
                        style={{ maxWidth: '150px' }} 
                        onError={(e) => {
                          console.error('Error loading logo image (Professional):', e);
                          console.log('Failed URL:', e.currentTarget.src);
                        }}
                      />
                    </div>
                  )}
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{fullName || 'Votre Nom'}</div>
                  <div style={{ color: primaryColor || '#0066cc', marginBottom: '5px' }}>{jobTitle || 'Votre Poste'}</div>
                  {companyName && <div style={{ marginBottom: '10px' }}>{companyName}</div>}
                </td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top', borderTop: `1px solid ${secondaryColor || '#f5f5f5'}`, paddingTop: '20px' }}>
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
            </>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Template Moderne
  const renderModernTemplate = () => {
    return (
      <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px', color: '#333', backgroundColor: secondaryColor || '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: signatureLayout === 'horizontal' ? 'row' : 'column', 
          alignItems: signatureLayout === 'horizontal' ? 'center' : 'flex-start', 
          marginBottom: '15px' 
        }}>
          {profilePhotoUrl && (
            <div style={{ marginRight: '15px' }}>
              <img 
                src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                alt="Photo de profil" 
                style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: '50%', objectFit: 'cover' }} 
                onError={(e) => {
                  console.error('Error loading profile photo:', e);
                }}
              />
            </div>
          )}
          {logoUrl && displayLogo && (
            <div style={{ marginRight: '15px' }}>
              <img 
                src={getFullLogoUrl(logoUrl)} 
                alt="Logo" 
                style={{ maxWidth: '80px' }} 
                onError={(e) => {
                  console.error('Error loading logo image (Modern):', e);
                  console.log('Failed URL:', e.currentTarget.src);
                }}
              />
            </div>
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
          {/* Photo de profil, Logo et nom */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            {profilePhotoUrl && (
              <div style={{ marginRight: '15px' }}>
                <img 
                  src={getFullProfilePhotoUrl(profilePhotoUrl)} 
                  alt="Photo de profil" 
                  style={{ width: `${photoSize}px`, height: `${photoSize}px`, borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} 
                  onError={(e) => {
                    console.error('Error loading profile photo:', e);
                  }}
                />
              </div>
            )}
            {logoUrl && displayLogo && (
              <div style={{ marginRight: '15px', background: 'white', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <img 
                  src={getFullLogoUrl(logoUrl)} 
                  alt="Logo" 
                  style={{ maxWidth: '80px', maxHeight: '80px' }} 
                  onError={(e) => {
                    console.error('Error loading logo image (Creative):', e);
                  }}
                />
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
