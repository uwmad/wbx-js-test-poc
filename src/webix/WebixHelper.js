import React from 'react';
import PropTypes from 'prop-types';

const { webix } = window;

class WebixHelper extends React.Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.createUI();
        this.updateWebixData();
    }

    componentDidUpdate(prevProps) {
        // Recreate UI if the configuration changes
        const { config } = this.props;
        if (JSON.stringify(prevProps.config) !== JSON.stringify(config)) {
            //console.log('recreating webix component');
            this.ui.destructor();
            this.createUI();
        }

        this.updateWebixData();
    }

    componentWillUnmount() {

         if(this.ui){
            this.ui.destructor();
         }else{
            //console.error('componentWillUnmount did not have a ui to unmount', this);
         }
    }

    setWebixData(data) {
        if(this.ui){
            if (this.ui.setValues) {
                this.ui.setValues(data);

            } else if (this.ui.parse) {
                this.ui.clearAll();
                this.ui.parse(data);

            } else if (this.ui.setValue) {
                this.ui.setValue(data);
            }

        }
    }

    updateWebixData() {
        const { data } = this.props;
        if (data) {
            this.setWebixData(JSON.parse(JSON.stringify(data))); //deep copy to avoid immutability error
        }
    }

    createUI() {
        const { webixInitFn, config, eventHandlers } = this.props;
        if(typeof webixInitFn === 'function'){
            this.ui = webixInitFn(this); //initializer code passed in as props
        }else{
            //do not use custom webix init function
            this.ui = webix.ui({
                ...config,
                on: eventHandlers,
                container: this.ref.current,
            });
        }

    }

    render() {
        const { style } = this.props;
        return <div ref={this.ref} style={style} />;
    }

}

WebixHelper.defaultProps = {
    config : {},
    data: undefined,
    eventHandlers: {},
    webixInitFn : null,
    style: {},

};

WebixHelper.propTypes = {
    config: PropTypes.object,
    data: PropTypes.array,
    eventHandlers: PropTypes.object,
    webixInitFn: PropTypes.func,
    style: PropTypes.object,
};

export default WebixHelper;