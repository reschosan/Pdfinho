import { fireEvent, render, screen } from '@testing-library/react'
import Dropzone from './Dropzone'
import { DropzoneRootProps } from 'react-dropzone'

describe('Dropzone', () => {
  const getRootProps = <T extends DropzoneRootProps>(props?: T) => props ?? ({} as T)
  const getInputProps = <T extends DropzoneRootProps>(props?: T) =>
    props ?? ({} as T)

  it('renders the Dropzone element', () => {
    render(<Dropzone getRootProps={getRootProps} getInputProps={getInputProps} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should accept a file when user selects one', () => {
    render(<Dropzone getRootProps={getRootProps} getInputProps={getInputProps} />)
    const input = document.querySelector('input[type="file"]')
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' })

    // Simulate file upload
    fireEvent.change(input as HTMLInputElement, { target: { files: [file] } })

    // Expect the input to have the file
    expect((input as HTMLInputElement).files?.[0]).toBe(file)
    expect((input as HTMLInputElement).files).toHaveLength(1)
    expect((input as HTMLInputElement).files?.[0].name).toBe('hello.pdf')
  })
})
