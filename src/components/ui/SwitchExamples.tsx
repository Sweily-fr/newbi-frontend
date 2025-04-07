import React, { useState } from 'react';
import { Switch } from './Switch';

export const SwitchExamples: React.FC = () => {
  const [basicSwitch, setBasicSwitch] = useState(false);
  const [labeledSwitch, setLabeledSwitch] = useState(true);
  const [disabledSwitch, setDisabledSwitch] = useState(false);
  const [coloredSwitch, setColoredSwitch] = useState(false);
  
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Switch Component Examples</h2>
      
      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Basic Switch</h3>
          <Switch 
            id="basic-switch"
            checked={basicSwitch}
            onChange={setBasicSwitch}
          />
          <p className="mt-2 text-sm text-gray-600">
            Current state: {basicSwitch ? 'On' : 'Off'}
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Switch with Labels</h3>
          <Switch 
            id="labeled-switch"
            checked={labeledSwitch}
            onChange={setLabeledSwitch}
            leftLabel="Off"
            rightLabel="On"
          />
          <p className="mt-2 text-sm text-gray-600">
            Current state: {labeledSwitch ? 'On' : 'Off'}
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Disabled Switch</h3>
          <Switch 
            id="disabled-switch"
            checked={disabledSwitch}
            onChange={setDisabledSwitch}
            disabled={true}
          />
          <p className="mt-2 text-sm text-gray-600">
            This switch is disabled and cannot be toggled.
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Custom Class Switch</h3>
          <Switch 
            id="custom-switch"
            checked={coloredSwitch}
            onChange={setColoredSwitch}
            className="custom-switch"
            leftLabel="Light"
            rightLabel="Dark"
          />
          <p className="mt-2 text-sm text-gray-600">
            This switch demonstrates how to add custom classes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SwitchExamples;
