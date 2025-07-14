import { Linking, Text, TextProps, TextStyle } from 'react-native';

export interface ITextWithTag extends TextProps {
  text: string;
  style: TextStyle;
  links?: string[];
}

const TextWithTag = ({
  text,
  style,
  links = [],
  ...textProps
}: ITextWithTag) => {
  const parts = text.split(
    /(<b>|<\/b>|<i>|<\/i>|<bi>|<\/bi>|<l>|<\/l>|<bl>|<\/bl>|<bold>|<\/bold>)/,
  );

  let localUnderlineIndex = -1;

  return (
    <Text style={style}>
      {parts.map((part, index) => {
        const isOpenTag =
          part === '<b>' ||
          part === '<i>' ||
          part === '<bi>' ||
          part === '<l>' ||
          part === '<bl>' ||
          part === '<bold>';
        const isCloseTag =
          part === '</b>' ||
          part === '</i>' ||
          part === '</bi>' ||
          part === '</l>' ||
          part === '</bl>' ||
          part === '</bold>';

        if (isOpenTag || isCloseTag) return null;
        const isBold =
          index > 0 &&
          (parts[index - 1] === '<b>' || parts[index - 1] === '<bold>');
        const isItalic = index > 0 && parts[index - 1] === '<i>';
        const isBoldItalic = index > 0 && parts[index - 1] === '<bi>';
        const isUnderline = index > 0 && parts[index - 1] === '<l>';
        const isBoldUnderline = index > 0 && parts[index - 1] === '<bl>';

        const textStyle: TextStyle = {
          fontWeight:
            isBold || isBoldItalic || isBoldUnderline ? 'bold' : 'normal',
          fontStyle: isItalic || isBoldItalic ? 'italic' : 'normal',
          textDecorationLine:
            isUnderline || isBoldUnderline ? 'underline' : 'none',
        };

        const shouldUseLink = isUnderline || isBoldUnderline;
        const linkIndex = shouldUseLink ? ++localUnderlineIndex : -1;

        const handlePress =
          shouldUseLink && links[linkIndex]
            ? () => Linking?.openURL(links[linkIndex])
            : undefined;

        return (
          <Text
            key={index}
            style={textStyle}
            onPress={handlePress}
            {...textProps}
          >
            {part}
          </Text>
        );
      })}
    </Text>
  );
};

export default TextWithTag;
