import * as React from 'react';
import { Box, Flex, FlameFlexProps } from '../Core';
import { Text } from '../Text';

export type AnnotatedLayoutProps = {
  /** H4 title of AnnotatedLayout */
  title: string;
  /** Small Text description of AnnotatedLayout */
  description: string;
  /** Extra components to render below description */
  renderExtras?: React.ReactNode;
  /** Body of AnnotatedLayout, to display to the right */
  children: React.ReactNode;
} & FlameFlexProps &
  React.HTMLAttributes<HTMLBaseElement>;

export const AnnotatedLayout: React.FunctionComponent<AnnotatedLayoutProps> = ({
  title,
  description,
  renderExtras,
  children,
  ...restProps
}) => (
  <Flex flexWrap="wrap" {...(restProps as any)}>
    <Box width={[1, 1 / 3, 1 / 4]} pr={[0, 4]}>
      <h2 className="vd-text-sub-heading vd-mb4">{title}</h2>
      <Text mb={3}>{description}</Text>
      {renderExtras && <Box mb={3}>{renderExtras}</Box>}
    </Box>
    <Box width={[1, 2 / 3, 3 / 4]}>{children}</Box>
  </Flex>
);
