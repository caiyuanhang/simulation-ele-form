<script lang="ts">
	import type { ArrayableFormItemRule } from './baseType';
	import type { Arrayable } from './baseType';
	// -------------------------------------------
	/**
	 * @description Label text.
	 */
	export let label: string | undefined = undefined;
	/**
	 * @description Width of label, e.g. `'50px'`. `'auto'` is supported.
	 */
	export let labelWidth: string | number = '';
	/**
	 * @description Position of label. If set to `'left'` or `'right'`, `label-width` prop is also required. The default is extend from `form label-position`.
	 */
	export let labelPosition: 'left' | 'right' | 'top' | '' = '';
	/**
	 * @description  A key of `model`. It could be an array of property paths (e.g `['a', 'b', '0']`). In the use of `validate` and `resetFields` method, the attribute is required.
	 */
	export let prop: Arrayable<string> | undefined = undefined;
	/**
	 * @description Whether the field is required or not, will be determined by validation rules if omitted.
	 */
	export let required: boolean | undefined = undefined;
	/**
	 * @description Validation rules of form, see the [following table](#formitemrule), more advanced usage at [async-validator](https://github.com/yiminghe/async-validator).
	 */
	export let rules: ArrayableFormItemRule | undefined = undefined;
	/**
	 * @description Field error message, set its value and the field will validate error and show this message immediately.
	 */
	export let error: string = '';
	/**
	 * @description Validation state of formItem.
	 */
	export let validateStatus: ['', 'error', 'validating', 'success'] | undefined = undefined;
	/**
	 * @description Same as for in native label.
	 */
	export let labelFor: string = '';
	/**
	 * @description Inline style validate message.
	 */
	export let inlineMessage: string | boolean = '';
	/**
	 * @description Whether to show the error message.
	 */
	export let showMessage: boolean = true;
	// -------------------------------------------
</script>
