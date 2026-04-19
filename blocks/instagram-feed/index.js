import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit() {
		const blockProps = useBlockProps( { style: { background: '#1A1A1A', padding: '30px 28px', color: '#fff' } } );
		return (
			<div { ...blockProps }>
				<p style={ { fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18px', marginBottom: '12px' } }>Follow along</p>
				<p style={ { color: '#888', fontSize: '13px' } }>Instagram feed carousel — configure handle and posts via ACF fields.</p>
			</div>
		);
	},
	save: () => null,
} );
