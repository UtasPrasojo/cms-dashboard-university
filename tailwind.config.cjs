/** @type {import('tailwindcss').Config} */
const custom_colors = {
    text: {
        100: '#F4F4F4',
        200: '#EAEAEA',
        300: '#ACACAC',
        400: '#6E6E6E',
        500: '#303030',
        600: '#222222',
        700: '#131313',
        800: '#1B0F12',
        900: '#17090E',
    },
    border: {
        'light': '#EFEFEF',
        'default': '#E6E6E6',
        'hover': '#E0E0E0',
        'dark': '#DBDBDB',
        'disabled': '#F4F4F4',
        100: '#F4F4F4',
        200: '#EFEFEF',
        300: '#E6E6E6',
        400: '#DBDBDB',
    },
    base: {
        white: '#FFFFFF',
        light: '#F9FBFE',
        section: '#F0F3FF',
        grey: '#CCCCCC',
        black: '#303030',
        dark: '#131313',
    },
    primary: {
        50: 'var(--color-primary-50)',
        100: 'var(--color-primary-100)',
        200: 'var(--color-primary-200)',
        300: 'var(--color-primary-300)',
        400: 'var(--color-primary-400)',
        500: 'var(--color-primary-500)',
        600: 'var(--color-primary-600)',
        700: 'var(--color-primary-700)',
        800: 'var(--color-primary-800)',
        900: 'var(--color-primary-900)',
    },
    error: {
        100: '#FEDFDD',
        200: '#FDBFBB',
        300: '#FDA09A',
        400: '#FC8078',
        500: '#FB6056',
        600: '#C94D45',
        700: '#973A34',
        800: '#642622',
        900: '#321311',
    },
    success: {
        100: '#CDF2E6',
        200: '#9BE5CC',
        300: '#6AD7B3',
        400: '#38CA99',
        500: '#06BD80',
        600: '#059766',
        700: '#04714D',
        800: '#024C33',
        900: '#01261A',
    },
    information: {
        100: '#D9E2FF',
        200: '#B3C6FF',
        300: '#8CA9FF',
        400: '#668DFF',
        500: '#4070FF',
        600: '#335ACC',
        700: '#264399',
        800: '#1A2D66',
        900: '#0D1633'
    },
    warning: {
        100: '#FFF5DA',
        200: '#FFEAB5',
        300: '#FFE08F',
        400: '#FFD56A',
        500: '#FFCB45',
        600: '#CCA237',
        700: '#997A29',
        800: '#66511C',
        900: '#33290E',
    },
    alert: {
        100: '#FFECDA',
        200: '#FFD9B5',
        300: '#FFC58F',
        400: '#FFB26A',
        500: '#FF9F45',
        600: '#CC7F37',
        700: '#995F29',
        800: '#66401C',
        900: '#33200E'
    },
}
module.exports = {
    content: [
        './src/views/**/*.vue',
        './src/views/*.vue',
        './src/components/*.vue',
        './src/components/**/*.vue',
        './src/views/*.vue',
        './src/views/**/*.vue',
        './src/layouts/*.vue',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    plugins: [],
    theme: {
        extend: {
            colors: {
                // base colors
                base: custom_colors.base,
                primary: custom_colors.primary,
                error: custom_colors.error,
                success: custom_colors.success,
                information: custom_colors.information,
                warning: custom_colors.warning,
                alert: custom_colors.alert,
                // token colors
                filter: {
                    primary: custom_colors.base.section
                },
                surface: {
                    primary: custom_colors.base.light,
                    secondary: custom_colors.base.section,
                    content: custom_colors.base.white
                },
                text: {
                    ...custom_colors.text,
                    primary: custom_colors.base.black,
                    secondary: custom_colors.text['400']
                },
                border: {
                    ...custom_colors.border,
                    primary: custom_colors.border['400'],
                    secondary: custom_colors.border['200']
                },
                button: {
                    background: {
                        primary: custom_colors.primary['500'],
                        success: custom_colors.success['500'],
                        information: custom_colors.success['500'],
                        warning: custom_colors.warning['500'],
                        alert: custom_colors.alert['500'],
                        error: custom_colors.error['500']
                    },
                    'border-primary': custom_colors.primary['500'],
                    'filter-background': custom_colors.base.section
                }
            },
            fontWeight: {
                'Regular': '400',
                'Medium': '500',
                'SemiBold': '600',
                'Bold': '700'
            },
            fontSize: {
                clamp: "clamp(1rem, 1.2vw, 30px)",
                'Body-1': ['18px', {
                    lineHeight: '27px',
                    letterSpacing: '0.4px'
                }],
                'Body-2': ['16px', {
                    lineHeight: '22.4px',
                    letterSpacing: '-0.3px'
                }],
                'Body-3': ['14px', {
                    lineHeight: '22.4px',
                    letterSpacing: '-0.28px'
                }],
                'Body-4': ['12px', {
                    lineHeight: '19.2px',
                    letterSpacing: '-0.24px'
                }],
                'Body-5': ['10px', {
                    lineHeight: '16px',
                    letterSpacing: '-0.2px'
                }],
                'Body-6': ['8px', {
                    lineHeight: '12.8px',
                    letterSpacing: '-0.16px'
                }],
                'SubTitle-1': ['21px', {
                    lineHeight: '21px',
                    letterSpacing: '-0.4px'
                }],
                'SubTitle-2': ['24px', {
                    lineHeight: '24px',
                    letterSpacing: '-0.24px',
                }],
                'SubTitle-3': ['24px', {
                    lineHeight: '36px',
                    letterSpacing: '-0.48px'
                }],
                'SubTitle-4': ['20px', {
                    lineHeight: '30px',
                    letterSpacing: '-0.4px'
                }],
                'SubTitle-5': ['18px', {
                    lineHeight: '27px',
                    letterSpacing: '-0.4px'
                }],
                'SubTitle-6': ['18px', {
                    lineHeight: '29px',
                    letterSpacing: '-0.4px'
                }],
                'titleDesc-1': ['16px', {
                    lineHeight: '25.6px',
                    letterSpacing: '-0.3px',
                }],
                'customDesc-1': ['18px', {
                    lineHeight: '32.4px',
                    letterSpacing: '-0.4px'
                }]
            },
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif'],
                'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
                'sf-pro-display': 'SF_Pro_Display'
            }
        }
    }
};