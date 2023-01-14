import { SendTransactionOptions, WalletAccountError, WalletConfigError, WalletConnectionError, WalletDisconnectionError, WalletError, WalletName, WalletNotConnectedError, WalletNotReadyError, WalletPublicKeyError, WalletSendTransactionError, WalletSignMessageError, WalletSignTransactionError } from '@solana/wallet-adapter-base';
import { BaseMessageSignerWalletAdapter, WalletReadyState } from '@solana/wallet-adapter-base';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { SolanaWallet } from "@web3auth/solana-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { SafeEventEmitterProvider } from "@web3auth/base";

export interface Web3AuthWalletAdapterConfig {
    params: Web3AuthOptions;
}
export const Web3AuthWalletName = 'Web3Auth' as WalletName<"Web3Auth">;
export class Web3AuthWalletAdapter extends BaseMessageSignerWalletAdapter {
    name = Web3AuthWalletName;
    url = 'https://web3auth.io';
    icon = 'data:image/png;base64,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';
    readonly supportedTransactionVersions = null;
    private _connecting: boolean;
    private _wallet: SolanaWallet | null;
    private _publicKey: PublicKey | null;
    private _params: Web3AuthOptions;
    private _readyState: WalletReadyState =
        typeof window === 'undefined' || typeof document === 'undefined'
            ? WalletReadyState.Unsupported
            : WalletReadyState.Loadable;
    //
    private _web3auth: Web3Auth | null;
    private _provider: SafeEventEmitterProvider | null;


    constructor(
        { params }: Web3AuthWalletAdapterConfig
    ) {
        super();
        this._connecting = false;
        this._wallet = null;
        this._publicKey = null;
        this._params = params;
        this._web3auth = null;
        this._provider = null;
    }

    get publicKey() {
        return this._publicKey;
    }

    get connecting() {
        return this._connecting;
    }

    get connected() {
        return !!this._wallet;
    }

    get readyState() {
        return this._readyState;
    }

    async connect(): Promise<void> {
        if (this.connected || this.connecting) return;
        if (this._readyState !== WalletReadyState.Loadable) throw new WalletNotReadyError();
        
        this._connecting = true;

        try {
            try {
                const web3auth = new Web3Auth({
                clientId: this._params?.clientId,
                web3AuthNetwork: this._params?.web3AuthNetwork, // mainnet, aqua, celeste, cyan or testnet
                chainConfig: this._params?.chainConfig,
                });
        
                this._web3auth = web3auth;
                await this._web3auth.initModal();

                if (!web3auth) {
                    throw new WalletConfigError("web3auth not initialized yet");
                  }
        
                if (this._web3auth.provider) {
                    this._provider = this._web3auth?.provider;
                };
                const web3authProvider = await this._web3auth.connect();
        
                this._provider = web3authProvider;
                console.log(web3authProvider)
            } catch (error: any) {
                throw new WalletConnectionError(error?.message, error);
            }
            if (!this._provider) throw new WalletConfigError('no provider');

            const wallet = new SolanaWallet(this._provider);

            let accounts: string[];
            try {
                accounts = await wallet.requestAccounts();

            } catch (error: any) {
                throw new WalletAccountError(error?.message, error);
            }

            let publicKey: PublicKey;
            try {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                publicKey = new PublicKey(accounts[0]!);
            } catch (error: any) {
                throw new WalletPublicKeyError(error?.message, error);
            }

            this._wallet = wallet;
            this._publicKey = publicKey;

            this.emit('connect', publicKey);
          
        } catch (error: any) {
            this.emit('error', error);
            throw error;
          } finally {
            this._connecting = false;
        }
    }

    async disconnect(): Promise<void> {
        const wallet = this._wallet;
        if (wallet) {
            this._wallet = null;
            this._publicKey = null;

            try {
                wallet?.provider?.removeAllListeners?.();
            } catch (error: any) {
                this.emit('error', new WalletDisconnectionError(error?.message, error));
            }
        }

        this.emit('disconnect');
    }
    async sendTransaction(transaction: Transaction, connection: Connection, options: SendTransactionOptions = {}): Promise<TransactionSignature> {
        if (!this._wallet || !this._provider) throw new WalletNotConnectedError();
        
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                const { signers, ...sendOptions } = options;

                transaction = await this.prepareTransaction(transaction, connection, sendOptions);

                signers?.length && transaction.partialSign(...signers);

                sendOptions.preflightCommitment = sendOptions.preflightCommitment || connection.commitment;

                const { signature } = await wallet.signAndSendTransaction(transaction);
                return signature;
            } catch (error: any) {
                if (error instanceof WalletError) throw error;
                throw new WalletSendTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }
    
    async signTransaction<T extends Transaction>(transaction: T): Promise<T> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                return ((await wallet.signTransaction(transaction)) as T) || transaction;
            } catch (error: any) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async signAllTransactions<T extends Transaction>(transactions: T[]): Promise<T[]> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                return ((await wallet.signAllTransactions(transactions)) as T[]) || transactions;
            } catch (error: any) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async signMessage(message: Uint8Array): Promise<Uint8Array> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                return await wallet.signMessage(message);
            } catch (error: any) {
                throw new WalletSignMessageError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }
}
//# sourceMappingURL=adapter.d.ts.map