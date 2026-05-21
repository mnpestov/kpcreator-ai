import * as yup from 'yup';

export const profileSchema = yup.object({
  name: yup.string().required('Имя обязательно'),
  email: yup
    .string()
    .email('Некорректный email')
    .required('Email обязателен'),
  job: yup.string().nullable(),
  tel: yup.string().nullable(),
  password: yup.string().nullable(),
  newPassword: yup
    .string()
    .nullable()
    .min(6, 'Минимум 6 символов')
    .when('password', {
      is: (val) => !!val,
      then: (schema) =>
        schema.required('Введите новый пароль'),
    }),
});
