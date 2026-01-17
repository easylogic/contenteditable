// Type definition
export interface NodeTypeDefinition {
  name: string;
  category: string;
  schema: string;
  modelExample: string;
  htmlSerialization: string;
  htmlDeserialization: string;
  viewIntegration: string;
  commonIssues: string;
  implementation: string;
}

// All node types map - import individually to avoid circular dependency
import { document } from './document';
import { paragraph } from './paragraph';
import { text } from './text';
import { heading } from './heading';
import { hardBreak } from './hardBreak';
import { horizontalRule } from './horizontalRule';
import { bold } from './bold';
import { italic } from './italic';
import { underline } from './underline';
import { strikethrough } from './strikethrough';
import { code } from './code';
import { link } from './link';
import { color } from './color';
import { highlight } from './highlight';
import { fontSize } from './fontSize';
import { fontFamily } from './fontFamily';
import { blockquote } from './blockquote';
import { codeBlock } from './codeBlock';
import { orderedList } from './orderedList';
import { bulletList } from './bulletList';
import { listItem } from './listItem';
import { image } from './image';
import { video } from './video';
import { audio } from './audio';
import { iframe } from './iframe';
import { table } from './table';
import { tableRow } from './tableRow';
import { tableCell } from './tableCell';
import { tableHeader } from './tableHeader';
import { card } from './card';
import { cardHeader } from './cardHeader';
import { cardBody } from './cardBody';
import { accordion } from './accordion';
import { tabs } from './tabs';
import { columns } from './columns';
import { divider } from './divider';
import { callout } from './callout';
import { math } from './math';
import { diagram } from './diagram';
import { chart } from './chart';
import { map } from './map';
import { calendar } from './calendar';
import { poll } from './poll';
import { quiz } from './quiz';
import { embed } from './embed';
import { mention } from './mention';
import { hashtag } from './hashtag';
import { bookmark } from './bookmark';
import { annotation } from './annotation';
import { customBlock } from './customBlock';
import { section } from './section';

export const allNodeTypes: Record<string, NodeTypeDefinition> = {
  document,
  paragraph,
  text,
  heading,
  hardBreak,
  horizontalRule,
  bold,
  italic,
  underline,
  strikethrough,
  code,
  link,
  color,
  highlight,
  fontSize,
  fontFamily,
  blockquote,
  codeBlock,
  orderedList,
  bulletList,
  listItem,
  image,
  video,
  audio,
  iframe,
  table,
  tableRow,
  tableCell,
  tableHeader,
  card,
  cardHeader,
  cardBody,
  accordion,
  tabs,
  columns,
  divider,
  callout,
  math,
  diagram,
  chart,
  map,
  calendar,
  poll,
  quiz,
  embed,
  mention,
  hashtag,
  bookmark,
  annotation,
  customBlock,
  section,
};
