import type { RuleItem } from 'async-validator';

export type Arrayable<T> = T | T[];

export interface FormItemRule extends RuleItem {
	trigger?: Arrayable<string>;
}

export type ArrayableFormItemRule = Arrayable<FormItemRule>;

type Primitive = null | undefined | string | number | boolean | symbol | bigint;

type BrowserNativeObject = Date | FileList | File | Blob | RegExp;

/**
 * Check whether it is tuple
 *
 * 检查是否为元组
 *
 * @example
 * IsTuple<[1, 2, 3]> => true
 * IsTuple<Array[number]> => false
 */
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;

/**
 * Array method key
 *
 * 数组方法键
 */
type ArrayMethodKey = keyof any[];

/**
 * Tuple index key
 *
 * 元组下标键
 *
 * @example
 * TupleKey<[1, 2, 3]> => '0' | '1' | '2'
 */
type TupleKey<T extends ReadonlyArray<any>> = Exclude<keyof T, ArrayMethodKey>;

/**
 * Helper type for recursively constructing paths through a type
 *
 * 用于通过一个类型递归构建路径的辅助类型
 */
type PathImpl<K extends string | number, V> = V extends Primitive | BrowserNativeObject
	? `${K}`
	: `${K}` | `${K}.${Path<V>}`;

/**
 * Type which collects all paths through a type
 *
 * 通过一个类型收集所有路径的类型
 *
 * @see {@link FieldPath}
 */
type Path<T> =
	T extends ReadonlyArray<infer V>
		? IsTuple<T> extends true
			? {
					[K in TupleKey<T>]-?: PathImpl<Exclude<K, symbol>, T[K]>;
				}[TupleKey<T>] // tuple
			: PathImpl<number, V> // array
		: {
				[K in keyof T]-?: PathImpl<Exclude<K, symbol>, T[K]>;
			}[keyof T]; // object

type FieldPath<T> = T extends object ? Path<T> : never;

export type FormRules<T extends Record<string, any> | string = string> = Partial<
	Record<T extends string ? T : FieldPath<T>, Arrayable<FormItemRule>>
>;
