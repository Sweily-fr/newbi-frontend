import React, { useEffect } from 'react';
import { TextFieldProps } from '../../types/ui';
import { TextField } from './TextField';
import { useFormContext, Controller } from 'react-hook-form';

/**
 * Composant spécialisé pour les champs URL qui ajoute automatiquement "https://"
 * si l'utilisateur ne l'a pas saisi
 */
export const TextFieldURL: React.FC<Omit<TextFieldProps, 'type'>> = ({
  id,
  name,
  register,
  validation = {},
  ...rest
}) => {
  const methods = useFormContext();
  
  // Si on utilise react-hook-form avec le Controller
  if (methods && !register) {
    return (
      <Controller
        control={methods.control}
        name={name}
        rules={validation}
        render={({ field, fieldState }) => (
          <TextField
            id={id}
            name={name}
            type="url"
            error={fieldState.error}
            value={field.value || ''}
            onChange={(e) => {
              let value = e.target.value;
              // Si la valeur n'est pas vide et ne commence pas par http:// ou https://
              if (value && !value.match(/^https?:\/\//)) {
                // On retire les éventuels "www." au début
                if (value.startsWith('www.')) {
                  value = value.substring(4);
                }
                // On ajoute https:// au début
                value = `https://${value}`;
              }
              field.onChange(value);
            }}
            onBlur={field.onBlur}
            placeholder=""
            {...rest}
          />
        )}
      />
    );
  }
  
  // Si on utilise react-hook-form avec register
  if (register) {
    // On modifie la fonction onChange du register pour ajouter https:// si nécessaire
    const registerProps = register(name, validation);
    const originalOnChange = registerProps.onChange;
    
    return (
      <TextField
        id={id}
        name={name}
        type="url"
        register={undefined}
        {...registerProps}
        onChange={(e) => {
          let value = e.target.value;
          // Si la valeur n'est pas vide et ne commence pas par http:// ou https://
          if (value && !value.match(/^https?:\/\//)) {
            // On retire les éventuels "www." au début
            if (value.startsWith('www.')) {
              value = value.substring(4);
            }
            // On ajoute https:// au début
            e.target.value = `https://${value}`;
          }
          // On appelle la fonction onChange originale
          if (originalOnChange) {
            originalOnChange(e);
          }
        }}
        placeholder=""
        {...rest}
      />
    );
  }
  
  // Utilisation standard (sans react-hook-form)
  return (
    <TextField
      id={id}
      name={name}
      type="url"
      onChange={(e) => {
        let value = e.target.value;
        // Si la valeur n'est pas vide et ne commence pas par http:// ou https://
        if (value && !value.match(/^https?:\/\//)) {
          // On retire les éventuels "www." au début
          if (value.startsWith('www.')) {
            value = value.substring(4);
          }
          // On ajoute https:// au début
          e.target.value = `https://${value}`;
        }
        if (rest.onChange) {
          rest.onChange(e);
        }
      }}
      placeholder=""
      {...rest}
    />
  );
};