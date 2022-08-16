import {useEffect, useState} from 'react'
import './App.css'

import { KeyringLocalProvider, KeyringLocalAccount, KeyringLocalOptions } from '@unique-nft/accounts/keyring-local';

function useAccounts(): [KeyringLocalProvider, boolean, KeyringLocalAccount[]] {
    const [accounts, setAccounts] = useState<KeyringLocalAccount[]>([]);
    const [isReady, setIsReady] = useState(false);

    const options: KeyringLocalOptions = {
        passwordCallback: () => new Promise<string>((resolve, reject) => {
            const password: string | null = prompt('password');

            if (typeof password === 'string') {
                resolve(password);
            } else {
                reject(new Error('cancelled'))
            }
        }),
    };

    const provider = new KeyringLocalProvider(options);
    provider.on("accountsChanged", setAccounts);

    useEffect(() => {
        console.log('!!!!!!!!!!!!!!!!!!!!!!');
        provider.init().then(async () => {
            const accounts = await provider.getAccounts();

            setAccounts(accounts);
            setIsReady(true);
        }).catch(() => {});
    }, []);

    return [provider, isReady, accounts];
}

function KeyringLocalSample() {
    const [provider, isReady, accounts] = useAccounts();
    const [unsignedTx, setUnsignedTx] = useState<any>(null);
    const [signedTx, setSignedTx] = useState<any>(null);

    const [uriToAdd, setUriToAdd] = useState('//Alice');
    const [password, setPassword] = useState('');

    const buildTx = async () => {
        const account = await provider.first();

        const body = {
            "address": account.instance.address,
            "destination": 'unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx',
            "amount": 0.01
        }

        const unsignedTx = await fetch(
            'https://web.uniquenetwork.dev/balance/transfer?use=Build',
            {
                method: 'post',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            },
        ).then((res) => res.json());

        setUnsignedTx(unsignedTx);
    }

    const signTx = async () => {
        const account = await provider.first();

        const signed = await account!.getSigner().sign(unsignedTx);

        setSignedTx(signed);
    }

    const addAccount = () => {
        setUriToAdd(uriToAdd === '//Alice' ? '' : '//Alice');
        setPassword('');

        provider.addUri(uriToAdd, password);
    }
    const onUriChange = (event) => setUriToAdd(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);

    return (
        <div className="App">
            {unsignedTx && <pre>{JSON.stringify(unsignedTx)}</pre>}
            {signedTx && <pre>{JSON.stringify(signedTx)}</pre>}
            <label>URI <input value={uriToAdd} onChange={onUriChange}/></label>
            <label>Password <input value={password} onChange={onPasswordChange}/></label>
            <button onClick={addAccount}>Add account</button>
            <button disabled={!isReady || unsignedTx} onClick={buildTx}>Build Tx</button>
            <button disabled={!isReady || signedTx} onClick={signTx}>Sign Tx</button>

            {accounts.map((account) => <p key={account.instance.address}>{account.instance.address}</p>)}
        </div>
    )
}

export default KeyringLocalSample;
