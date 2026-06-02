import * as yup from 'yup';

export const profileSchema = yup.object({
  name: yup.string().required('Имя обязательно'),
  email: yup
    .string()
    .email('Некорректный email')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  job: yup.string().nullable(),
  tel: yup.string().required('Телефон обязателен'),
  password: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  newPassword: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .min(6, 'Минимум 6 символов')
    .when('password', {
      is: (val) => !!val && val.length > 0,
      then: (schema) => schema.required('Введите новый пароль'),
    }),
});

