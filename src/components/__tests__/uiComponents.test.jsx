/**
 * React Component tests for UI components: VoteButton, Avatar, CategoryBadge
 *
 * Test scenarios:
 *
 * VoteButton:
 * 1. should render up vote button with correct icon and count
 * 2. should render down vote button with correct icon and count
 * 3. should apply active class when vote is active
 * 4. should not apply active class when vote is not active
 * 5. should call onVote handler when clicked
 * 6. should be disabled when disabled prop is true
 *
 * Avatar:
 * 7. should render img tag when src is provided
 * 8. should render initials when no src is provided
 * 9. should show '?' when no name and no src
 * 10. should apply correct size class
 *
 * CategoryBadge:
 * 11. should render category text with # prefix
 * 12. should apply active class when active prop is true
 * 13. should call onClick handler when clicked
 * 14. should not apply active class when active prop is false
 */

import { render, screen, fireEvent } from '@testing-library/react';
import VoteButton from '../ui/VoteButton';
import Avatar from '../ui/Avatar';
import CategoryBadge from '../ui/CategoryBadge';

// ─── VoteButton ────────────────────────────────────────────────────────────────

describe('VoteButton component', () => {
  // Test 1: renders up vote button
  it('should render up vote button with correct icon and count', () => {
    render(<VoteButton type="up" count={5} active={false} onVote={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('▲')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  // Test 2: renders down vote button
  it('should render down vote button with correct icon and count', () => {
    render(<VoteButton type="down" count={3} active={false} onVote={() => {}} />);
    expect(screen.getByText('▼')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // Test 3: active class applied
  it('should apply active class when vote is active', () => {
    render(<VoteButton type="up" count={1} active onVote={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('vote-btn--active');
  });

  // Test 4: inactive class not applied
  it('should not apply active class when vote is not active', () => {
    render(<VoteButton type="up" count={1} active={false} onVote={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('vote-btn--active');
  });

  // Test 5: onVote handler called
  it('should call onVote handler when clicked', () => {
    const mockOnVote = jest.fn();
    render(<VoteButton type="up" count={0} active={false} onVote={mockOnVote} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnVote).toHaveBeenCalledTimes(1);
  });

  // Test 6: disabled state
  it('should be disabled when disabled prop is true', () => {
    render(<VoteButton type="up" count={0} active={false} onVote={() => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

// ─── Avatar ───────────────────────────────────────────────────────────────────

describe('Avatar component', () => {
  // Test 7: renders img when src provided
  it('should render img tag when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" name="Alice" />);
    const img = screen.getByAltText('Alice');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  // Test 8: renders initials when no src
  it('should render initials when no src is provided', () => {
    render(<Avatar name="Alice Johnson" />);
    expect(screen.getByText('AJ')).toBeInTheDocument();
  });

  // Test 9: shows '?' when no name and no src
  it('should show question mark when no name and no src', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  // Test 10: size class applied
  it('should apply correct size class', () => {
    const { container } = render(<Avatar name="Bob" size="lg" />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass('avatar--lg');
  });
});

// ─── CategoryBadge ────────────────────────────────────────────────────────────

describe('CategoryBadge component', () => {
  // Test 11: renders with # prefix
  it('should render category text with # prefix', () => {
    render(<CategoryBadge category="react" onClick={() => {}} />);
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  // Test 12: active class applied
  it('should apply active class when active prop is true', () => {
    render(<CategoryBadge category="coding" active onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('category-badge--active');
  });

  // Test 13: onClick handler called
  it('should call onClick handler when clicked', () => {
    const mockOnClick = jest.fn();
    render(<CategoryBadge category="general" onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  // Test 14: active class not applied when inactive
  it('should not apply active class when active prop is false', () => {
    render(<CategoryBadge category="tech" active={false} onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('category-badge--active');
  });
});
