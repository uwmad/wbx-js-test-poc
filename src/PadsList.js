import React from 'react';
import PropTypes from 'prop-types';
import WebixHelper from './webix/WebixHelper';
import Dropdown from "./Dropdown";
import uuidv4 from 'uuid/v4';

const{ webix } = window;

/*eslint-disable func-names*/  //Functions passed in to webix are not arrow functions so that 'this' refers to webix instance.
/*eslint-disable react/no-this-in-sfc*/  //'this' is used to refer to webix in the handlers
/*eslint-disable arrow-body-style */  //leaving this so that our code looks more like the webix docs
/*eslint-disable react/self-closing-comp */ //two components contents are populated with vanilla js

const PadsList = (props) => {

    const { padsData, pagination, changePagination, shouldPaginate, height} = props;

    /* Stuff Related to Pagination Behavior */
    const pagerId = `PadsList_Pager_${uuidv4()}`;
    const pagerValues = [10,20,30,40,50,100];

    const pagerHtmlTemplate = `{common.first()}{common.prev()}<span class="spacer"></span>{common.next()}{common.last()}`;

    const pagerConfig = {
            size: pagination,
            template : pagerHtmlTemplate,
            container : pagerId,
            on : { 
                onAfterRender(){
                    
                    const {count, size, page, limit } = this.data;
                    const pagerNode = this.$view.parentNode;
                    const pagerBarNode = pagerNode.parentNode;

                    if(pagerBarNode){

                        const firstButton = pagerBarNode.querySelector('[webix_p_id="first"]') || {};
                        const prevButton  = pagerBarNode.querySelector('[webix_p_id="prev"]') || {};
                        const nextButton  = pagerBarNode.querySelector('[webix_p_id="next"]') || {};
                        const lastButton  = pagerBarNode.querySelector('[webix_p_id="last"]') || {};

                        const positionInfoNode = pagerBarNode.querySelector('.pagesListInfo');

                        const start = Math.min(  ( page * size ) + 1 , count );
                        const end = Math.min( ( page + 1 ) * size , count ); 

                        if(count <= size){

                            pagerBarNode.classList.add('disabled-pager');
                            firstButton.disabled = true;
                            prevButton.disabled = true;
                            nextButton.disabled = true;
                            lastButton.disabled = true;

                        }else{

                            pagerBarNode.classList.remove('disabled-pager');

                            if ( page === 0){

                                firstButton.disabled = true;
                                prevButton.disabled = true;
                                nextButton.disabled = false;
                                lastButton.disabled = false;

                            } else if (page === limit - 1){

                                firstButton.disabled = false;
                                prevButton.disabled = false;
                                nextButton.disabled = true;
                                lastButton.disabled = true;

                            } else {

                                firstButton.disabled = false;
                                prevButton.disabled = false;
                                nextButton.disabled = false;
                                lastButton.disabled = false;

                            }

                        }//check limits

                        if(positionInfoNode){
                            positionInfoNode.innerHTML = `${start} to ${end} of ${count} `; //Info Text
                        }

                    }//pagerBarNode exists

                },
            },
    };

    /*Stuff Related to DataTable, Actions Buttons*/
    const actionsButtonHtmlTemplate = `<div class="pad-actions-buttons">
                                        <button class="fa fa-edit  pad-actions-edit"/>
                                        <button class="fa fa-share pad-actions-preview"/>
                                        <button class="fa fa-trash pad-actions-delete"/>
                                       </div>`;

    const editPadHandler = function(event, cell){
        const {editPad, onEditPad} = props;
        const { row } = cell;
        const { id, padType } = this.getItem(row);

        onEditPad(id, padType, editPad);

        return false;
    };

    const previewPadHandler = function(event, cell){
        const { previewPad } = props;
        const { row } = cell;
        const { id } = this.getItem(row);

        previewPad(id);
        return false;
    };

    const deletePadHandler = function(event, cell){
        const { deletePad } = props;
        const { row } = cell;
        const { id, name } = this.getItem(row);

        webix.modalbox({
            type:"confirm",
            title:"Delete Pad",
            text:`Are you sure you want to permanently delete ${name}?`,
            buttons:["Cancel","Delete","x"],
        })
            .then((result)=>{

                if(result === '1'){ 
                    deletePad(id); //String '1' 
                }

            });

            return false;
    };

    const padsListClickHandlers = {
        'pad-actions-edit' : editPadHandler,
        'pad-actions-preview' : previewPadHandler,
        'pad-actions-delete' : deletePadHandler,
    };

    const getConfig = ()=>{

        const config = {
            view: 'datatable',
            css:"pads-list noselect webix_header_border webix_data_border", 
            height,
            rowHeight: 30,
            scroll: 'y',
            sorting: true,
            onClick : padsListClickHandlers,
            columns:[
                { 
                    id:"name",
                    header:{
                        text: "Name",
                        css: "sortable-column-header",
                    },
                    fillspace:true,
                    sort:"string",
                },
                { 
                    id:"modified",
                    header:{
                        text: "Modified Date",
                        css: "sortable-column-header",
                    },
                    width:170,
                    format:webix.i18n.longDateFormatStr,
                    map:"(date)#modified#", //map to coerce type for sort
                    sort:"date",
                },
                { 
                    id:"padType",
                    header:{
                        text: "Type",
                        css: "sortable-column-header",
                    },
                    width:240,
                    map:"#padType.type#", //map to get sub property
                    sort:"string",
                },
                { 
                    id:"actions",
                    header:{ 
                        text: "Actions",
                        css:"actions-column-header",
                    },
                    width:220,
                    template: actionsButtonHtmlTemplate,
                },
            ],
            
        };

        //add pager if applicable
        if(shouldPaginate === true){
            config.pager = pagerConfig;
        }
        
        return config;

    };
    

    const init = (helper) => {

            //Wipe out Pager
            const pager = document.getElementById(pagerId);
            if(pager){
                pager.innerHTML = '';
            }

            return webix.ui({
                ...getConfig(),
                container: helper.ref.current,
            });
    };

    return(
        <React.Fragment>

            <WebixHelper config={{pagination}} data={padsData} webixInitFn={init} />

           { shouldPaginate && (

                <div className="pagerBar">
                    <div className="pager" id={pagerId} ></div>
                    <div className="pagesSelect">
                            <Dropdown
                                id={`${pagerId}_Dropdown`}
                                placeholder={`${pagination}`}
                                onSelect={changePagination}
                                width={80}
                                options={pagerValues.map((e)=>`${e}`)}
                            />
                            <span>Items per page</span>

                    </div>
                    <div className="pagesListInfo"></div>
                </div>

            )}


        </React.Fragment>
        );

};


PadsList.defaultProps = {
    padsData:[],
    pagination:10,
    height:330,
    changePagination:( )=>{ },
    shouldPaginate :false,
};

PadsList.propTypes = {
    padsData: PropTypes.array,
    pagination: PropTypes.number,
    height: PropTypes.number,
    changePagination : PropTypes.func,
    shouldPaginate : PropTypes.bool,
    editPad : PropTypes.func.isRequired,
    previewPad : PropTypes.func.isRequired,
    deletePad : PropTypes.func.isRequired,
    onEditPad : PropTypes.func.isRequired,

};

export default PadsList;