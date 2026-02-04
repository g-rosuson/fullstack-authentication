import type { ToolRegistry } from '../tools/types';

import Scraper from './scraper';

const toolRegistry: ToolRegistry = {
    scraper: new Scraper(),
};

export default toolRegistry;
