import {useState} from 'react'
import './App.css'

import PolkadotSample from "./PolkadotSample";
import MetamaskSample from "./MetamaskSample";
import KeyringSample from "./KeyringSample";
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
    Keyring: KeyringSample,
    KeyringLocal: KeyringLocalSample,
}

function App() {
  const getSampleType = () => {
      const hash = window.location.hash.replace('#', '');

      return hash && Object.values(SampleType).includes(hash)
          ? hash
          : SampleType.Polkadot;
  }

  const [sampleType, setSampleType] = useState(getSampleType());
  const onSelect = (event) => {
      window.location.hash = event.target.value;
      setSampleType(event.target.value);
  }

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
