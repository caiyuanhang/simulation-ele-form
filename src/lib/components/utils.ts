import type { FormItemContext } from './types';
import type { FormItemProp } from './formItem';
import type { Arrayable } from './baseType';

export const filterFields = (fields: FormItemContext[], props: Arrayable<FormItemProp>) => {
	const normalized = Array.isArray(props) ? props : [props];
	return normalized.length > 0
		? fields.filter((field) => field.prop && normalized.includes(field.prop))
		: fields;
};
