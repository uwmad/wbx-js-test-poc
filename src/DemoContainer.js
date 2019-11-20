import React from 'react';
import Dropdown from './Dropdown';
import PadsList from './PadsList';
import mockPadsData from './mockPadsData.json';

class DemoContainer extends React.Component {

    constructor (props){
        super(props);
        this.state = {
            pagination : 10,
        };
        this.changePagination = this.changePagination.bind(this);
    }

    changePagination (pagination){

        this.setState((prevState)=>{

            if( !(pagination !== pagination) && pagination > 0 && (prevState.pagination !== Number(pagination))){
                return ({
                    pagination : Number(pagination),
                });
            }

        });

    }

    render() {
        const { company, name } = this.state;
        return (

		    <div style={{ width:'900px',margin:'25px auto'}}>
		    	<h2 key={'Dropdown-h2'}>Dropdown</h2>

			    <Dropdown
			    	id="dropdown_1"
			        options = { ['item1','item2','item3','item4'] }
			        width = { 100 }
			        onSelect = { function(){ alert('onSelect' + JSON.stringify(arguments) ); console.log(arguments) } }
			        placeholder = { 'placeholder' }
			        disabled = { false }
			        value = { 'item1' }
			    />


		    	<h2 key={'Datatable-h2'}>Datatable</h2>

		    	<PadsList
		    		    padsData = {mockPadsData}
					    pagination = {this.state.pagination}
					    changePagination = { this.changePagination }
					    shouldPaginate = { true }
					    editPad = { function(){ alert('editPad' + JSON.stringify(arguments) ); console.log(arguments) } }
					    previewPad = { function(){ alert('previewPad' + JSON.stringify(arguments) ); console.log(arguments) } }
					    deletePad = { function(){ alert('deletePad' + JSON.stringify(arguments) ); console.log(arguments) } }
					    onEditPad = { function(){ alert('onEditPad' + JSON.stringify(arguments) ); console.log(arguments) } }
		    	/>

		    </div>

        );
    };

}

export default DemoContainer;