import {ValueMap} from '../../common/model/value-map';
import {ParamsParsers, parseParams} from '../../common/params';
import {BladeParams} from '../common/api/types';
import {BladePlugin} from '../plugin';
import {TabApi} from './api/tab';
import {TabController} from './controller/tab';
import {TabPageController} from './controller/tab-page';

export interface TabBladeParams extends BladeParams {
	pages: {
		title: string;
	}[];
	view: 'tab';
}

export const TabBladePlugin: BladePlugin<TabBladeParams> = {
	id: 'tab',
	accept(params) {
		const p = ParamsParsers;
		const result = parseParams<TabBladeParams>(params, {
			pages: p.required.array(p.required.object({title: p.required.string})),
			view: p.required.literal('tab'),
		});
		if (result && result.pages.length === 0) {
			return null;
		}
		return result ? {params: result} : null;
	},
	controller(args) {
		const c = new TabController(args.document, {
			blade: args.blade,
			viewProps: args.viewProps,
		});
		args.params.pages.forEach((p) => {
			const pc = new TabPageController(args.document, {
				itemProps: new ValueMap({
					selected: false as boolean,
					title: p.title,
				}),
				props: new ValueMap({
					selected: false as boolean,
				}),
			});
			c.add(pc);
		});
		return c;
	},
	api(controller) {
		if (!(controller instanceof TabController)) {
			return null;
		}
		return new TabApi(controller);
	},
};
