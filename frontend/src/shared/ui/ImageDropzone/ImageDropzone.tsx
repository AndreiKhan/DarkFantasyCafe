import { useRef, useState, useId, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { uploadImage } from '@/shared/api'
import { getApiErrorMessage } from '@/shared/lib/apiError'
import closeIcon from '@/assets/images/close-icon.webp'
import './ImageDropzone.scss'
import Loader from '../Loader/Loader'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function validate(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'errors:validation.imageType'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'errors:validation.imageSize'
  }
  return null
}

function ImageDropzone({ value, onChange, multiple = false, label, error }: {
  value: string[]
  onChange: (value: string[]) => void
  multiple?: boolean
  label?: string
  error?: string
}) {
  const { t } = useTranslation()
  const errorId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [pendingCount, setPendingCount] = useState(0)

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return
    }
    setLocalError(null)

    const files = multiple ? Array.from(fileList) : [fileList[0]!]
    let nextValue = multiple ? [...value] : []

    for (const file of files) {
      const validationError = validate(file)
      if (validationError) {
        setLocalError(t(validationError))
        continue
      }

      setPendingCount((count) => count + 1)
      try {
        const { url } = await uploadImage(file)
        nextValue = multiple ? [...nextValue, url] : [url]
        onChange(nextValue)
      } catch (uploadError) {
        setLocalError(getApiErrorMessage(uploadError, t))
      } finally {
        setPendingCount((count) => count - 1)
      }
    }
  }

  const openPicker = () => inputRef.current?.click()

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    handleFiles(event.dataTransfer.files)
  }

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className='image-dropzone'>
      {label &&
        <span className='image-dropzone__label'>
          {label}
        </span>
      }

      <div className='image-dropzone__grid'>
        {value.map((url, index) => (
          <div key={`${url}-${index}`} className='image-dropzone__thumb'>
            <img src={url} alt='' role='presentation' />
            <button
              style={{ backgroundImage: `url(${closeIcon})` }}
              type='button'
              className='image-dropzone__remove'
              onClick={() => remove(index)}
              aria-label={t('common:upload.removeImage')}
            />
          </div>
        ))}
        <div
          className={`image-dropzone__drop ${isDragOver ? 'image-dropzone__drop--over' : ''} ${pendingCount > 0 ? 'image-dropzone__drop--busy' : ''}`}
          onClick={openPicker}
          onDragOver={(event) => { event.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          role='button'
          tabIndex={0}
          aria-label={t('common:a11y.uploadImage')}
          aria-busy={pendingCount > 0}
          aria-invalid={Boolean(localError ?? error)}
          aria-describedby={(localError ?? error) ? errorId : undefined}
          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openPicker() }}
        >
          {pendingCount > 0 ? (
            <span className='image-dropzone__drop-text'>
              <Loader />
            </span>
          ) : (
            <>
              <span className='image-dropzone__drop-icon'>+</span>
              <span className='image-dropzone__drop-text'>
                {!multiple && value.length > 0
                  ? <>{t('common:upload.replace')}<br />{t('common:upload.file')}</>
                  : <>{t('common:upload.dragHere')}<br />{t('common:upload.orClickToSelect')}</>}
              </span>
            </>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type='file'
        accept={ACCEPTED_TYPES.join(',')}
        multiple={multiple}
        hidden
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {(localError ?? error) &&
        <span className='image-dropzone__error' id={errorId} role='alert'>
          {localError ?? error}
        </span>
      }
    </div>
  )
}

export default ImageDropzone
