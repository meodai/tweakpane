import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {RangeConstraint} from '../plugin/common/constraint/range';
import {StepConstraint} from '../plugin/common/constraint/step';
import {ConstraintUtil} from '../plugin/common/constraint/util';
import {Point2dConstraint} from '../plugin/input-bindings/point-2d/constraint/point-2d';
import {Point2dPadTextController} from '../plugin/input-bindings/point-2d/controller/point-2d-pad-text';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
	[
		{
			expectedClass: Point2dPadTextController,
			params: {},
			value: {x: 12, y: 34},
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return class ${testCase.expectedClass.name}`, () => {
				const pane = createPane();
				const obj = {foo: testCase.value};
				const bapi = pane.addInput(obj, 'foo', testCase.params);
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);
			});
		});
	});

	it('should create appropriate step constraint', () => {
		const pane = createPane();
		const obj = {foo: {x: 12, y: 34}};
		const bapi = pane.addInput(obj, 'foo', {
			x: {
				step: 1,
			},
		});

		const c = bapi.controller.binding.value.constraint;
		if (!(c instanceof Point2dConstraint)) {
			throw new Error('Unexpected constraint');
		}
		const xc = c.xConstraint;
		if (!xc) {
			throw new Error('Unexpected constraint');
		}
		const sc = ConstraintUtil.findConstraint(xc, StepConstraint);
		assert.strictEqual(sc && sc.step, 1);
	});

	it('should create appropriate range constraint', () => {
		const pane = createPane();
		const obj = {foo: {x: 12, y: 34}};
		const bapi = pane.addInput(obj, 'foo', {
			y: {
				max: 456,
				min: -123,
			},
		});

		const c = bapi.controller.binding.value.constraint;
		if (!(c instanceof Point2dConstraint)) {
			throw new Error('Unexpected constraint');
		}
		const yc = c.yConstraint;
		if (!yc) {
			throw new Error('Unexpected constraint');
		}
		const rc = ConstraintUtil.findConstraint(yc, RangeConstraint);
		assert.strictEqual(rc && rc.minValue, -123);
		assert.strictEqual(rc && rc.maxValue, 456);
	});
});
