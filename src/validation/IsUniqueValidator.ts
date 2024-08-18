import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from "class-validator";
import { Not } from "typeorm";

import { AppDataSource } from "@/database/data-source";

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  defaultMessage?(): string {
    return `$property is already in use.`;
  }

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entity, field] = args.constraints;

    const repo = AppDataSource.getRepository(entity);
    const isUpdate: boolean = args.object["id"] !== undefined;

    let count = 0;

    if (!isUpdate) {
      count = await repo.count({
        where: { [field]: value },
      });
    } else {
      count = await repo.count({
        where: { [field]: value, id: Not(args.object["id"]) },
      });
    }

    return count <= 0;
  }
}

export function IsUnique(
  entity: any,
  field: string,
  validatorOptions?: ValidatorOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validatorOptions,
      constraints: [entity, field],
      validator: IsUniqueConstraint,
    });
  };
}
