import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import * as viser from 'viser';
import { PluginContext } from './PluginService';
import { Slider } from './Slider';

function firstLowerCase(str: string) {
  return str.replace(/^\S/, (s: any) => {
    return s.toLowerCase();
  });
}

@Component({
  providers: [PluginContext],
  selector: 'v-plugin',
  template: `<div>
    <v-slider></v-slider>
  </div>`,
})

export class PluginComponent implements AfterViewInit, OnChanges {
  public context: PluginContext;
  private config: any = {};
  private vcRef: any;

  constructor(context: PluginContext, vcRef: ViewContainerRef) {
    this.context = context;
    this.vcRef = vcRef;
  }

  public ngAfterViewInit() {
    this.initPlugin();
  }

  public ngOnChanges(changes: SimpleChanges) {
    this.initPlugin();
  }

  private combineContentConfig(displayName: string, props: any, config: any) {
    const realName = firstLowerCase(displayName);
    const nameLowerCase = displayName.toLowerCase();

    config[nameLowerCase] = props;
  }

  private getProps(allProps: any) {
    const strippingProperties = ['chartDiv', 'combineContentConfig', 'config', 'constructor', 'context', 'vcRef',
      'getProps', 'initPlugin', 'renderPlugin',
      'ngOnInit', 'ngAfterViewInit', 'ngOnChanges'];
    if (allProps) {
      const properties: {
        [key: string]: string,
      } = {};
      for (const key in allProps) {
        if (strippingProperties.indexOf(key) === -1) {
          properties[key] = allProps[key];
        }
      }
      return properties;
    }

    return allProps;
  }

  private initPlugin() {
    const name = this.constructor.name;
    const props = this.getProps(this);
    this.config = this.context.config;

    if (name === 'PluginComponent') {
      this.renderPlugin(true);
    } else if (name === 'Slider') {
      props.container = this.context.container;
      this.combineContentConfig(name, props, this.config);
    }
  }

  private renderPlugin(rerender?: boolean) {
    viser.Plugin(this.config);
  }
}
