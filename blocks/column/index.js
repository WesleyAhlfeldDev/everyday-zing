import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import metadata from './block.json';

const NONE    = { label: '— None —',    value: '' };
const DEFAULT = { label: '— Default —', value: '' };

const makeColOpts = ( bp ) => {
	const prefix = bp ? `col-${ bp }` : 'col';
	return [
		NONE,
		{ label: `${ prefix }  (equal width)`, value: prefix },
		{ label: `${ prefix }-auto`,           value: `${ prefix }-auto` },
		...[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( n ) => ( {
			label: `${ n } / 12`,
			value: `${ prefix }-${ n }`,
		} ) ),
	];
};

const makeOffsetOpts = ( bp ) => [
	NONE,
	...[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ].map( ( n ) => ( {
		label: `${ n } column${ n > 1 ? 's' : '' }`,
		value: `offset-${ bp }-${ n }`,
	} ) ),
];

const ALIGN_SELF_OPTS = [
	DEFAULT,
	{ label: 'Start',    value: 'align-self-start' },
	{ label: 'Center',   value: 'align-self-center' },
	{ label: 'End',      value: 'align-self-end' },
	{ label: 'Stretch',  value: 'align-self-stretch' },
	{ label: 'Baseline', value: 'align-self-baseline' },
];

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const { colXs, colSm, colMd, colLg, colXl, offsetMd, offsetLg, alignSelf } = attributes;

		const blockProps = useBlockProps( {
			style: {
				border: '2px dashed #C8E050',
				padding: '16px',
				minHeight: '60px',
				background: 'rgba(200,224,80,0.06)',
				flex: '1',
			},
		} );

		return (
			<>
				<InspectorControls>
					<PanelBody title="Width" initialOpen={ true }>
						<SelectControl label="Default (all screens)" value={ colXs } options={ makeColOpts( '' ) }   onChange={ ( v ) => setAttributes( { colXs: v } ) } />
						<SelectControl label="≥ SM  (576px)"         value={ colSm } options={ makeColOpts( 'sm' ) } onChange={ ( v ) => setAttributes( { colSm: v } ) } />
						<SelectControl label="≥ MD  (768px)"         value={ colMd } options={ makeColOpts( 'md' ) } onChange={ ( v ) => setAttributes( { colMd: v } ) } />
						<SelectControl label="≥ LG  (992px)"         value={ colLg } options={ makeColOpts( 'lg' ) } onChange={ ( v ) => setAttributes( { colLg: v } ) } />
						<SelectControl label="≥ XL  (1200px)"        value={ colXl } options={ makeColOpts( 'xl' ) } onChange={ ( v ) => setAttributes( { colXl: v } ) } />
					</PanelBody>
					<PanelBody title="Offset & Align" initialOpen={ false }>
						<SelectControl label="Offset ≥ MD" value={ offsetMd }  options={ makeOffsetOpts( 'md' ) } onChange={ ( v ) => setAttributes( { offsetMd: v } ) } />
						<SelectControl label="Offset ≥ LG" value={ offsetLg }  options={ makeOffsetOpts( 'lg' ) } onChange={ ( v ) => setAttributes( { offsetLg: v } ) } />
						<SelectControl label="Align Self"   value={ alignSelf } options={ ALIGN_SELF_OPTS }         onChange={ ( v ) => setAttributes( { alignSelf: v } ) } />
					</PanelBody>
				</InspectorControls>

				<div { ...blockProps }>
					<span style={ { display: 'block', marginBottom: '8px', fontSize: '9px', fontWeight: '700', letterSpacing: '.1em', textTransform: 'uppercase', color: '#4E6A10' } }>
						Column { colMd || colLg ? `/ ${ colMd || colLg }` : '' }
					</span>
					<InnerBlocks renderAppender={ InnerBlocks.ButtonBlockAppender } />
				</div>
			</>
		);
	},

	save() {
		return <InnerBlocks.Content />;
	},
} );
