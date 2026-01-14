const platformConfiguration = {
    jobsCh: {
        baseUrl: 'https://www.jobs.ch/en/vacancies/',
        extractionGlobs: ['https://www.jobs.ch/en/vacancies/detail/**'],
        selectors: {
            resultsContainer: '[aria-label="Job list"]', // Container for job cards
            itemSelector: '[data-cy="job-link"]', // Individual job card
            titleSelector: '[data-cy="vacancy-title"]', // Job title
            descriptionSelector: '[data-cy="vacancy-description"]', // Job description
            infoSelector: '[data-cy="vacancy-info"]', // Job info
            companyNameSelector: '[data-cy="company-link"]', // Company name link
            vacancyLogoSelector: '[data-cy="vacancy-logo"]', // Vacancy logo
            descriptionParsing: {
                allSpans: 'p > strong > span, p > span, ul > li > span', // All relevant spans for description parsing
                titleContainer: 'p > strong', // Container for section titles
                paragraph: 'p', // Paragraph element
                listItem: 'ul > li', // List item element
                strong: 'strong', // Strong element for checking if paragraph contains title
            },
            informationParsing: {
                list: 'ul', // List container for information items
                listItem: 'li', // Individual list item
                span: 'span', // Span elements within list items
                svg: 'svg', // SVG element to filter out icon spans
            },
            companyNameParsing: {
                span: 'span', // Span elements within company name container
                svg: 'svg', // SVG element to filter out icon spans
                label: 'Company', // Label for company name information item
            },
        },
    },
} as const;

const constants = {
    platformConfiguration,
    requestLabels: {
        targetRequest: 'target-request',
        extractionRequest: 'extraction-request',
    },
} as const;

export default constants;
