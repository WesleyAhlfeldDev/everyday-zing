import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit() {
		const blockProps = useBlockProps( { style: { background: '#F8F7F5', padding: '40px 28px', textAlign: 'center', borderTop: '0.5px solid #E8E4DE' } } );
		return (
			<div { ...blockProps }>
				<p style={ { fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '22px', marginBottom: '8px' } }>
					Get your weekly <em style={ { color: '#6B1F3A' } }>zing</em>
				</p>
				<p style={ { color: '#888', fontSize: '13px' } }>Email newsletter signup form.</p>
			</div>
		);
	},
	save: () => null,
} );
