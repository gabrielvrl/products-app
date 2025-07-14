import { Linking } from 'react-native';

import { render } from '@testing-library/react-native';
import { TextWithTag } from 'components';
import { ITextWithTag } from '.';

const defaultProps: ITextWithTag = {
  text: 'Hello World',
  style: {},
};

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

describe('TextWithTag Component (Native)', () => {
  const renderTextWithTags = (props?: Partial<ITextWithTag>) => {
    return render(<TextWithTag {...defaultProps} {...props} />);
  };

  it('renders plain text correctly', () => {
    const { getByText } = renderTextWithTags();
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders bold text correctly', () => {
    const { getByText } = renderTextWithTags({ text: 'Hello <b>World</b>' });
    const boldText = getByText('World');
    expect(boldText).toBeTruthy();
    expect(boldText.props.style.fontWeight).toBe('bold');
  });

  it('renders italic text correctly', () => {
    const { getByText } = renderTextWithTags({ text: 'Hello <i>World</i>' });
    const italicText = getByText('World');
    expect(italicText).toBeTruthy();
    expect(italicText.props.style.fontStyle).toBe('italic');
  });

  it('renders bold and italic text correctly', () => {
    const { getByText } = renderTextWithTags({ text: 'Hello <bi>World</bi>' });
    const boldItalicText = getByText('World');
    expect(boldItalicText).toBeTruthy();
    expect(boldItalicText.props.style.fontWeight).toBe('bold');
    expect(boldItalicText.props.style.fontStyle).toBe('italic');
  });

  it('renders underlined text correctly', () => {
    const { getByText } = renderTextWithTags({ text: 'Hello <l>World</l>' });
    const underlinedText = getByText('World');
    expect(underlinedText.props.style.textDecorationLine).toBe('underline');
  });

  it('renders bold and underlined text correctly', () => {
    const { getByText } = renderTextWithTags({ text: 'Hello <bl>World</bl>' });
    const styledText = getByText('World');
    expect(styledText.props.style.fontWeight).toBe('bold');
    expect(styledText.props.style.textDecorationLine).toBe('underline');
  });

  it('calls Linking.openURL with correct link for each underlined tag', () => {
    const links = [
      'https://monavate.com/terms',
      'https://monavate.com/privacy',
      'https://gnosispay.com/terms',
      'https://gnosispay.com/privacy',
    ];

    const text =
      'By continuing, you accept the <bl>Terms of Service</bl> and <bl>Privacy Policy</bl> of Monavate, as well as the <bl>Terms of Service</bl> and <bl>Privacy Policy</bl> of Gnosis Pay';

    const { getAllByText } = renderTextWithTags({
      text,
      links,
    });

    const terms1 = getAllByText('Terms of Service')[0];
    const privacy1 = getAllByText('Privacy Policy')[0];
    const terms2 = getAllByText('Terms of Service')[1];
    const privacy2 = getAllByText('Privacy Policy')[1];

    terms1.props.onPress();
    privacy1.props.onPress();
    terms2.props.onPress();
    privacy2.props.onPress();

    expect(Linking.openURL).toHaveBeenCalledTimes(4);
    expect(Linking.openURL).toHaveBeenNthCalledWith(1, links[0]);
    expect(Linking.openURL).toHaveBeenNthCalledWith(2, links[1]);
    expect(Linking.openURL).toHaveBeenNthCalledWith(3, links[2]);
    expect(Linking.openURL).toHaveBeenNthCalledWith(4, links[3]);
  });

  it('renders multiple mixed styles correctly', () => {
    const { getByText } = renderTextWithTags({
      text: 'Hello <b>bold</b> <i>italic</i> <bl>bold-underlined</bl>',
    });

    expect(getByText('bold').props.style.fontWeight).toBe('bold');
    expect(getByText('italic').props.style.fontStyle).toBe('italic');
    expect(getByText('bold-underlined').props.style.fontWeight).toBe('bold');
    expect(getByText('bold-underlined').props.style.textDecorationLine).toBe(
      'underline',
    );
  });
});
