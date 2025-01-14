import {PropertyValues} from "lit";
import {customElement, property} from "lit/decorators.js";
import {OrMapMarker} from "./or-map-marker";
import {AttributeEvent, GeoJSONPoint, AssetEvent, AssetEventCause, Asset, SharedEvent, AssetDescriptor, WellknownAttributes} from "@openremote/model";
import {subscribe} from "@openremote/core";
import manager, {AssetModelUtil} from "@openremote/core";

export function getMarkerIconAndColorFromAssetType(type: AssetDescriptor | string | undefined): {icon: string, color: string | undefined} | undefined {
    if (!type) {
        return;
    }

    const descriptor = typeof(type) !== "string" ? type : AssetModelUtil.getAssetDescriptor(type);
    const icon = descriptor && descriptor.icon ? descriptor.icon : "help-circle";
    let color: string | undefined;

    if (descriptor && descriptor.colour) {
        color = descriptor.colour;
    }

    return {
        color: color,
        icon: icon
    };
}

@customElement("or-map-marker-asset")
export class OrMapMarkerAsset extends subscribe(manager)(OrMapMarker) {

    @property({type: String, reflect: true, attribute: true})
    public assetId?: string;

    @property({type: Object, attribute: true})
    public asset?: Asset;

    public assetTypeAsIcon: boolean = true;

    constructor() {
        super();
        this.visible = false;
    }

    protected markerColor?: string;

    protected set type(type: string | undefined) {
        const iconAndColor = getMarkerIconAndColorFromAssetType(type);

        if (!iconAndColor) {
            this.visible = false;
            return;
        }

        if (this.assetTypeAsIcon) {
            this.icon = iconAndColor.icon;
        }

        this.markerColor = iconAndColor.color;
        this.updateColor(this.markerContainer);
        this.visible = true;
    }

    protected shouldUpdate(_changedProperties: PropertyValues): boolean {
        if (_changedProperties.has("assetId")) {

            this.lat = undefined;
            this.lng = undefined;
            this.type = undefined;
            this.assetIds = this.assetId && this.assetId.length > 0 ? [this.assetId] : undefined;

            if (Object.keys(_changedProperties).length === 1) {
                return false;
            }
        }

        if (_changedProperties.has("asset")) {
            this.onAssetChanged(this.asset);
        }

        return super.shouldUpdate(_changedProperties);
    }

    public _onEvent(event: SharedEvent) {
        if (event.eventType === "attribute") {
            const attributeEvent = event as AttributeEvent;

            if (attributeEvent.attributeState!.ref!.name === WellknownAttributes.LOCATION) {
                this._updateLocation(attributeEvent.attributeState!.value as GeoJSONPoint);
                return;
            }

            return;
        }

        if (event.eventType === "asset") {
            const assetEvent = event as AssetEvent;

            switch (assetEvent.cause) {
                case AssetEventCause.READ:
                case AssetEventCause.CREATE:
                case AssetEventCause.UPDATE:
                    this.onAssetChanged(assetEvent.asset);
                    break;
                case AssetEventCause.DELETE:
                    this.onAssetChanged(undefined);
                    break;
            }
        }
    }

    protected onAssetChanged(asset?: Asset) {
        if (asset) {
            const attr = asset.attributes ? asset.attributes[WellknownAttributes.LOCATION] : undefined;
            this._updateLocation(attr ? attr.value as GeoJSONPoint : null);
            this.type = asset.type;
        } else {
            this.lat = undefined;
            this.lng = undefined;
        }
    }

    protected _updateLocation(location: GeoJSONPoint | null) {
        this.lat = location && location.coordinates ? (location.coordinates as any)[1] : undefined;
        this.lng = location && location.coordinates ? (location.coordinates as any)[0] : undefined;
    }

    protected getColor() {
        if (this.markerColor && !this.color) {
            return "#" + this.markerColor;
        }
        return super.getColor();
    }

    protected getActiveColor() {
        if (this.markerColor && !this.activeColor) {
            return "#" + this.markerColor;
        }
        return super.getActiveColor();
    }
}
