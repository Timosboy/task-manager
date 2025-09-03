import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Tasks from '../pages/Tasks'

describe('Tasks UI', () => {
  it('agrega, tilda y elimina una tarea', () => {
    render(<Tasks />)
    const input = screen.getByPlaceholderText(/nueva tarea/i)
    const addBtn = screen.getByRole('button', { name: /agregar/i })

    fireEvent.change(input, { target: { value: 'Probar UI' } })
    fireEvent.click(addBtn)

    const item = screen.getByText('Probar UI')
    expect(item).toBeInTheDocument()

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(item).toHaveClass('line-through')

    const del = screen.getByRole('button', { name: /eliminar/i })
    fireEvent.click(del)
    expect(screen.queryByText('Probar UI')).toBeNull()
  })
})
