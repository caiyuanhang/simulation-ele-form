<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { isFunction } from 'lodash-es';
	import type { ValidateFieldsError } from 'async-validator';

	import { formContextKey } from './constant';
	import { filterFields } from './utils';
	import type {
		FormContext,
		FormItemContext,
		FormValidateCallback,
		FormValidationResult
	} from './types';
	import type { Arrayable } from './baseType';
	import type { FormItemProp } from './formItem';

	// -------------------------------------------
	/**
	 * @description Whether to disable all components in this form. If set to `true`, it will override the `disabled` prop of the inner component.
	 */
	export let disabled: boolean = false;
	/**
	 * @description Data of form component.
	 */
	export let model: object = {};
	/**
	 * @description Validation rules of form.
	 */
	export let rules: Record<string, any> = {};
	/**
	 * @description Position of label. If set to `'left'` or `'right'`, `label-width` prop is also required.
	 */
	export let labelPosition: 'left' | 'right' | 'top' = 'right';
	/**
	 * @description Position of asterisk.
	 */
	export let requireAsteriskPosition: 'left' | 'right' = 'left';
	/**
	 * @description Whether to hide required fields should have a red asterisk (star) beside their labels.
	 */
	export let hideRequiredAsterisk: boolean = false;
	/**
	 * @description Width of label, e.g. `'50px'`. All its direct child form items will inherit this value. `auto` is supported.
	 */
	export let labelWidth: string | number = '';
	/**
	 * @description Suffix of the label.
	 */
	export let labelSuffix: string = '';
	/**
	 * @description Whether the form is inline.
	 */
	export let inline: boolean = false;
	/**
	 * @description Whether to display the error message inline with the form item.
	 */
	export let inlineMessage: boolean = false;
	/**
	 * @description Whether to display an icon indicating the validation result.
	 */
	export let statusIcon: boolean = false;
	/**
	 * @description Whether to show the error message.
	 */
	export let showMessage: boolean = true;
	/**
	 * @description Whether to trigger validation when the `rules` prop is changed.
	 */
	export let validateOnRuleChange: boolean = true;
	/**
	 * @description When validation fails, scroll to the first error form entry.
	 */
	export let scrollToError: boolean = false;
	/**
	 * @description When validation fails, it scrolls to the first error item based on the scrollIntoView option.
	 */
	export let scrollIntoViewOptions: Record<string, any> | boolean | undefined = undefined;
	// -------------------------------------------

	export const fields: FormItemContext[] = [];

	const getField: FormContext['getField'] = (prop) => {
		return fields.find((field) => field.prop === prop);
	};

	const addField: FormContext['addField'] = (field) => {
		fields.push(field);
	};

	const removeField: FormContext['removeField'] = (field) => {
		if (field.prop) {
			fields.splice(fields.indexOf(field), 1);
		}
	};

	export const resetFields: FormContext['resetFields'] = (properties = []) => {
		if (!model) {
			console.warn('model is required for resetFields to work.');
			return;
		}
		filterFields(fields, properties).forEach((field) => field.resetField());
	};

	export const clearValidate: FormContext['clearValidate'] = (props = []) => {
		filterFields(fields, props).forEach((field) => field.clearValidate());
	};

	$: isValidatable = (() => {
		const hasModel = !!model;
		if (!hasModel) {
			console.warn('model is required for validate to work.');
		}
		return hasModel;
	})();

	const obtainValidateFields = (props: Arrayable<FormItemProp>) => {
		if (fields.length === 0) return [];

		const filteredFields = filterFields(fields, props);
		if (!filteredFields.length) {
			console.warn('please pass correct props!');
			return [];
		}
		return filteredFields;
	};

	export const validate = async (callback?: FormValidateCallback): FormValidationResult =>
		validateField(undefined, callback);

	const doValidateField = async (props: Arrayable<FormItemProp> = []): Promise<boolean> => {
		if (!isValidatable) return false;

		const fields = obtainValidateFields(props);
		if (fields.length === 0) return true;

		let validationErrors: ValidateFieldsError = {};
		for (const field of fields) {
			try {
				await field.validate('');
			} catch (fields) {
				validationErrors = {
					...validationErrors,
					...(fields as ValidateFieldsError)
				};
			}
		}

		if (Object.keys(validationErrors).length === 0) return true;
		return Promise.reject(validationErrors);
	};

	export const validateField: FormContext['validateField'] = async (modelProps = [], callback) => {
		const shouldThrow = !isFunction(callback);
		try {
			const result = await doValidateField(modelProps);
			// When result is false meaning that the fields are not validatable
			if (result === true) {
				await callback?.(result);
			}
			return result;
		} catch (e) {
			if (e instanceof Error) throw e;

			const invalidFields = e as ValidateFieldsError;

			if (scrollToError) {
				scrollToField(Object.keys(invalidFields)[0]);
			}
			await callback?.(false, invalidFields);
			return shouldThrow && Promise.reject(invalidFields);
		}
	};

	export const scrollToField = (prop: FormItemProp) => {
		const field = filterFields(fields, prop)[0];
		if (field) {
			field.$el?.scrollIntoView(scrollIntoViewOptions);
		}
	};

	// deep watch
	$: {
		if (rules) {
			if (validateOnRuleChange) {
				validate().catch((err) => console.warn(err));
			}
		}
	}

	// relative label
	let potentialLabelWidthArr: number[] = [];
	$: autoLabelWidth = (() => {
		if (!potentialLabelWidthArr.length) return '0';
		const max = Math.max(...potentialLabelWidthArr);
		return max ? `${max}px` : '';
	})();
	const getLabelWidthIndex = (width: number) => {
		const index = potentialLabelWidthArr.indexOf(width);
		if (index === -1 && autoLabelWidth === '0') {
			console.warn(`unexpected width ${width}`);
		}
		return index;
	};
	const registerLabelWidth = (val: number, oldVal: number) => {
		if (val && oldVal) {
			const index = getLabelWidthIndex(oldVal);
			potentialLabelWidthArr.splice(index, 1, val);
		} else if (val) {
			potentialLabelWidthArr.push(val);
		}
		potentialLabelWidthArr = [...potentialLabelWidthArr]; // trigger response
	};
	const deregisterLabelWidth = (val: number) => {
		const index = getLabelWidthIndex(val);
		if (index > -1) {
			potentialLabelWidthArr.splice(index, 1);
		}
		potentialLabelWidthArr = [...potentialLabelWidthArr]; // trigger response
	};

	// provide store
	const formContext = writable({
		disabled,
		model,
		rules,
		labelPosition,
		requireAsteriskPosition,
		hideRequiredAsterisk,
		labelWidth,
		labelSuffix,
		inline,
		inlineMessage,
		statusIcon,
		showMessage,
		validateOnRuleChange,
		scrollToError,
		scrollIntoViewOptions,

		resetFields,
		clearValidate,
		validateField,
		getField,
		addField,
		removeField,

		autoLabelWidth,
		registerLabelWidth,
		deregisterLabelWidth
	});
	setContext(formContextKey, $formContext);

	$: console.log(
		'function==',
		isFunction(() => {}),
		model
	);
</script>

<form>
	<slot />
</form>
