import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import DateFilter from './DateFilter';

describe('DateFilter', () => {
  afterEach(cleanup);

  it('shows an empty input when no date is selected', () => {
    render(<DateFilter value="" onChange={() => {}} />);
    const input = screen.getByLabelText('Date') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('displays the provided date value', () => {
    render(<DateFilter value="2026-02-20" onChange={() => {}} />);
    const input = screen.getByLabelText('Date') as HTMLInputElement;
    expect(input.value).toBe('2026-02-20');
  });

  it('calls onChange with the selected date', () => {
    const onChange = vi.fn();
    render(<DateFilter value="" onChange={onChange} />);
    const input = screen.getByLabelText('Date');
    fireEvent.change(input, { target: { value: '2026-02-15' } });
    expect(onChange).toHaveBeenCalledWith('2026-02-15');
  });

  it('calls onChange with undefined when the date is cleared', () => {
    const onChange = vi.fn();
    render(<DateFilter value="2026-02-15" onChange={onChange} />);
    const input = screen.getByLabelText('Date');
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
