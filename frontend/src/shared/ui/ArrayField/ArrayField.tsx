import { useFieldArray, useFormContext } from 'react-hook-form'

function ArrayField({ name, label }: { name: string; label: string }) {
  const { control, register, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: name as never })

  const itemErrors = errors[name] as { message?: string }[] | undefined

  return (
    <div className="array-field">
      <div className="array-field__head">
        <span>{label}</span>
        <button type="button" onClick={() => append('' as never)}>
          +
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="array-field__row">
          <input {...register(`${name}.${index}` as const)} />
          <button type="button" onClick={() => remove(index)}>
            X
          </button>
          {itemErrors?.[index]?.message && (
            <span className="array-field__error">{itemErrors[index]?.message}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default ArrayField
