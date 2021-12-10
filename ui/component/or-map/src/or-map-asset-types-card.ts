import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {Asset, SharedEvent} from "@openremote/model";
import manager, {subscribe, Util} from "@openremote/core";
import "@openremote/or-icon";

export interface MapAssetTypesCardConfig {
    assets?: Asset[];
}

export class OrMapAssetTypesCardLoadAssetEvent extends CustomEvent<string> {

    public static readonly NAME = "or-map-asset-card-load-asset";

    constructor(assetId: string) {
        super(OrMapAssetTypesCardLoadAssetEvent.NAME, {
            bubbles: true,
            composed: true,
            detail: assetId
        });
    }
}

declare global {
    export interface HTMLElementEventMap {
        [OrMapAssetTypesCardLoadAssetEvent.NAME]: OrMapAssetTypesCardLoadAssetEvent;
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

        return html`${assetTypes.map(e => Util.getAssetTypeLabel(e))}`;
    }

    protected _loadAsset(assetId: string) {
        this.dispatchEvent(new OrMapAssetTypesCardLoadAssetEvent(assetId));
    }

}
