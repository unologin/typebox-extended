import ExtendedTypeBuilder from './main';
import * as Typebox from '@sinclair/typebox';
export declare const Type: ExtendedTypeBuilder;
export type Static<T extends Typebox.TSchema> = Typebox.Static<T>;
