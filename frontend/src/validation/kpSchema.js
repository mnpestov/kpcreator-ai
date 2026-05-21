// forms/kpSchema.js
import * as yup from 'yup';

const dateReg = /^(\d{2}\.\d{2}\.\d{4}|\d{4}-\d{2}-\d{2})$/;
const timeReg = /^\d{2}:\d{2}$/;

export const kpSchema = yup.object({
  kpNumber: yup
    .string()
    .required('Обязательное поле')
    .matches(/^\d{1,10}$/, 'Только цифры, 1–10 символов'),

  kpDate: yup
    .string()
    .required('Введите дату')
    .matches(dateReg, 'Формат DD.MM.YYYY'),

  contractNumber: yup
    .string()
    .required('Обязательное поле')
    .max(30, 'До 30 символов'),

  contractDate: yup
    .string()
    .required('Введите дату')
    .matches(dateReg, 'Формат DD.MM.YYYY'),

  startEvent: yup
    .string()
    .required('Введите дату')
    .matches(dateReg, 'Формат DD.MM.YYYY'),

  endEvent: yup
    .string()
    .required('Введите дату')
    .matches(dateReg, 'Формат DD.MM.YYYY')
    .test(
      'end-after-start',
      'Дата окончания раньше даты начала',
      function (value) {
        const { startEvent } = this.parent;
        if (!startEvent || !value) return true;
        return new Date(startEvent) <= new Date(value);
      }
    ),

  startTimeStartEvent: yup.string().matches(timeReg, 'HH:MM'),
  endTimeStartEvent: yup.string().matches(timeReg, 'HH:MM'),
  startTimeEndEvent: yup.string().matches(timeReg, 'HH:MM'),
  endTimeEndEvent: yup.string().matches(timeReg, 'HH:MM'),

  eventPlace: yup
    .string()
    .required('Обязательное поле')
    .min(2, 'Минимум 2 символа')
    .max(120, 'Максимум 120 символов'),

  countOfPerson: yup
    .number()
    .typeError('Введите число')
    .integer('Целое число')
    .min(1)
    .max(99999),

  logisticsCost: yup
    .number()
    .typeError('Введите число')
    .min(0, 'Не может быть отрицательным'),

  listTitle: yup
    .string()
    .required('Обязательное поле')
    .min(2)
    .max(80),

  isWithinMkad: yup.boolean(),
});
