import {useState} from 'react'
import './App.css'

import PolkadotSample from "./PolkadotSample";
import MetamaskSample from "./MetamaskSample";
import KeyringLocalSample from "./KeyringLocalSample";

enum SampleType {
    Polkadot = 'Polkadot',
    Metamask = 'Metamask',
    Keyring = 'Keyring',
    KeyringLocal = 'KeyringLocal',
}

const SAMPLES_MAP: Record<SampleType, Function> = {
    Polkadot: PolkadotSample,
    Metamask: MetamaskSample,
    Keyring: () => 'not implemented',
    KeyringLocal: KeyringLocalSample,
}

function App() {
  const [sampleType, setSampleType] = useState(SampleType.Polkadot);
  const onSelect = (event) => setSampleType(event.target.value);

  const SampleComponent = SAMPLES_MAP[sampleType];

  return (
    <div className="App">
        <select onChange={onSelect} value={sampleType}>
            {Object.values(SampleType).map((sampleType) => <option key={sampleType}>{sampleType}</option>)}
        </select>
        <SampleComponent/>
    </div>
  )
}

export default App
