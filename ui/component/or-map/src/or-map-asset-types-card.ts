import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {Asset, SharedEvent} from "@openremote/model";
import manager, {subscribe, Util} from "@openremote/core";
import "@openremote/or-icon";

export interface MapAssetTypesCardConfig {
    assets?: Asset[];
}

export class OrMapAssetTypesChangedEvent extends CustomEvent<string[]> {

    public static readonly NAME = "or-map-asset-types-changed";

    constructor(assetTypes: string[]) {
        super(OrMapAssetTypesChangedEvent.NAME, {
            bubbles: true,
            composed: true,
            detail: assetTypes
        });
    }
}

declare global {
    export interface HTMLElementEventMap {
        [OrMapAssetTypesChangedEvent.NAME]: OrMapAssetTypesChangedEvent;
    }
}

@customElement("or-map-asset-types-card")
export class OrMapAssetTypesCard extends subscribe(manager)(LitElement) {

    @property({type: Object})
    public config?: MapAssetTypesCardConfig;

    @property()
    protected assets: Asset[] = [];

    public _onEvent(event: SharedEvent) {

        if (event.eventType === "asset") {
            console.log('event asset')
        }

        if (event.eventType === "attribute") {
            console.log('event attr')
        }
    }

    protected async getCardConfig() { // : MapAssetTypesCardConfig | undefined
        if (!this.config) return;
        this.assets = this.config!.assets || [];
        console.log(this.assets);
    }

    protected render(): TemplateResult | undefined {
        console.log('start render');
        this.getCardConfig();
        if (!this.assets) {
            return html``;
        }

        const assetTypes = [... new Set(this.assets.map(e => e.type))];

        // return html`<pre>${JSON.stringify(this.assets.map(e => e.type), null, 2)}</pre>`;
        return html`<ul>
            ${assetTypes.map((assetType) => {
                return html`
                    <li @click="${() => this.handleAssetTypeClick(assetType!)}">${Util.getAssetTypeLabel(assetType)}</li>
                `;
            })}
        </ul>`;
        // return html`${assetTypes.map(e => Util.getAssetTypeLabel(e))}`;
    }

    protected handleAssetTypeClick(assetType: string) {
        this.dispatchEvent(new OrMapAssetTypesChangedEvent([assetType]));
    }

}
