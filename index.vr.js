import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  View,
  Mesh,
  Image,
  VrButton,
  Text
} from 'react-vr';

const DEFAULT_ANIMATION_BUTTON_RADIUS = 50;
const DEFAULT_ANIMATION_BUTTON_SIZE = 0.05;

class IALBlackHistoryMonth extends React.Component {
  // Create the constructor
  constructor (props) {
    // Use the constructor + super(props) + this.state
    super(props);
    this.state =  {
      // CREATE OUR SCENES
      scenes: [{scene_image: 'starry-sky.jpg', // this is the initial scene
                scene_title: 'Welcome to Innovation Artist Labs', // our scene title content
                scene_location: 'Minneapolis, MN',
                scene_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                step: 1, // Scene Counter #
                navigations: [{ step:2, // Link to the next scene
                                translate: [0.73,-0.15,0.66], // Placement of the button for this scene
                                rotation: [0,36,0] }] }, // The rotation of the button in this scene
               {scene_image: 'pano--new-york.jpg',
                scene_title: 'The Birthplace of Bernie Sanders', // our scene title content
                scene_location: 'New York, NY',
                scene_description: 'On 20 January 2016, the web site Democratic Underground posted a photography purportedly showing Bernie Sanders participating in a 1965 civil rights march from Selma to Montgomery (Alabama) with Martin Luther King, Jr. The web site identified the man standing “behind Coretta King, just right of Old Glory in the glasses, white ‘t’ shirt, open collar and dark jacket” as the future United States senator and 2016 Democratic presidential candidate.',
                step: 2,
                navigations: [{ step:3,
                                translate: [-0.43,-0.01,0.9],
                                rotation: [0,140,0] }]},
               {scene_image: 'pano--washington-dc.jpg',
                scene_title: 'Martin Luther King Give the "I Have a Dream" Speech', // our scene title content
                scene_location: 'Washington DC - 19??',
                scene_description: '"I Have a Dream" is a public speech delivered by American civil rights activist Martin Luther King Jr. during the March on Washington for Jobs and Freedom on August 28, 1963, in which he calls for an end to racism in the United States and called for civil and economic rights. Delivered to over 250,000 civil rights supporters from the steps of the Lincoln Memorial in Washington, D.C., the speech was a defining moment of the civil rights movement.',
                step: 3,
                navigations: [{ step:4,
                                translate: [-0.4,0.05,-0.9],
                                rotation: [0,0,0] }]},
               {scene_image: 'pano--los-angeles.jpg',
                step: 4,
                scene_title: 'The Watts Riots', // our scene title content
                scene_location: 'Watts County, Los Angeles, CA - 1965',
                scene_description: 'On August 11, 1965, an African-American motorist was pulled over on suspicion of reckless driving. A minor roadside argument broke out, and then escalated into a fight between family members and police.[2] The community reacted in outrage to allegations of police brutality that soon spread, and six days of looting and arson followed. Los Angeles police needed the support of nearly 4,000 members of the California Army National Guard to quell the riots, which resulted in 34 deaths[3] and over $40 million in property damage. The riots were blamed principally on police racism. It was the city\'s worst unrest until the Rodney King riots of 1992.',
                navigations: [{ step:5,
                                translate: [-0.55,-0.03,-0.8],
                                rotation: [0,32,0] }]},
               {scene_image: 'pano--chicago.jpg',
                step: 5,
                scene_title: 'Southern Christian Leadership', // our scene title content
                scene_location: 'Chicago, IL - 1962',
                scene_description: 'As early as 1962 SCLC began to broaden its focus to include issues of economic inequality. Seeing poverty as the root of social inequality, in 1962 SCLC began Operation Breadbasket in Atlanta to create new jobs in the black community. In 1966 the program spread to Chicago as part of the Chicago Campaign.',
                navigations: [{ step:1,
                                translate: [0.2,-0.03,-1],
                                rotation: [0,20,0] }]}],
      current_scene:{},  // An empty object to hold on to our Scene's data
      animationWidth: DEFAULT_ANIMATION_BUTTON_SIZE,
      animationRadius: DEFAULT_ANIMATION_BUTTON_RADIUS
      };
      this.onNavigationClick = this.onNavigationClick.bind(this);
      this.onMainWindowMessage = this.onMainWindowMessage.bind(this);
      this.animatePointer = this.animatePointer.bind(this);
      this.sceneOnLoad = this.sceneOnLoad.bind(this);
      this.sceneOnLoadEnd = this.sceneOnLoadEnd.bind(this);
  }

  componentWillMount(){
    window.addEventListener('message', this.onMainWindowMessage);
    this.setState({current_scene: this.state.scenes[0]})
  }

  componentWillUnmount(){
    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
  }

  componentDidMount(){
    this.animatePointer();
  }

  onMainWindowMessage(e){
    switch (e.data.type) {
      case 'newCoordinates':
        var scene_navigation = this.state.current_scene.navigations[0];
        this.state.current_scene.navigations[0]['translate'] = [e.data.coordinates.x,e.data.coordinates.y,e.data.coordinates.z]
        this.forceUpdate();
      break;
      default:
      return;
    }
  }

  onPanoInput(e){
    if (e.nativeEvent.inputEvent.eventType === 'keydown'){
      this.rotatePointer(e.nativeEvent.inputEvent)
    }
  }

  onNavigationClick(item,e){
    if(e.nativeEvent.inputEvent.eventType === "mousedown" && e.nativeEvent.inputEvent.button === 0){
      cancelAnimationFrame(this.frameHandle);
      var new_scene = this.state.scenes.find(i => i['step'] === item.step);
      this.setState({current_scene: new_scene});
      postMessage({ type: "sceneChanged"})
      this.state.animationWidth = DEFAULT_ANIMATION_BUTTON_SIZE;
      this.state.animationRadius = DEFAULT_ANIMATION_BUTTON_RADIUS;
      this.animatePointer();
    }
  }

  rotatePointer(nativeEvent){
    switch (nativeEvent.keyCode) {
      case 38:
        this.state.current_scene.navigations[0]['rotation'][1] += 4;
      break;
      case 39:
        this.state.current_scene.navigations[0]['rotation'][0] += 4;
      break;
      case 40:
        this.state.current_scene.navigations[0]['rotation'][2] += 4;
      break;
      default:
      return;
    }
    this.forceUpdate();
  }

  animatePointer(){
    var delta = this.state.animationWidth + 0.002;
    var radius = this.state.animationRadius + 10;

    if(delta >= 0.13){
       delta = DEFAULT_ANIMATION_BUTTON_SIZE;
       radius = DEFAULT_ANIMATION_BUTTON_RADIUS;
    }

    this.setState({animationWidth: delta, animationRadius: radius})
    this.frameHandle = requestAnimationFrame(this.animatePointer);
  }

  sceneOnLoad(){
    postMessage({ type: "sceneLoadStart"})
  }

  sceneOnLoadEnd(){
    postMessage({ type: "sceneLoadEnd"})
  }

  render() {
    var that = this;
    return (
      <View>
        <Pano source={asset(this.state.current_scene['scene_image'])}
              onInput={this.onPanoInput.bind(this)}
              onLoad={this.sceneOnLoad}
              onLoadEnd={this.sceneOnLoadEnd}
              style={{ transform: [{translate: [0, 0, 0]}] }}
        />
        <View style={{
          backgroundColor: '#FFFFFFD9'
        }}>
          <Text style={{
            fontSize: 0.5,
            width: 4,
            layoutOrigin: [0.5, 0.5],
            transform: [{translate: [0, 1, -3]}]
          }}
          >{this.state.current_scene['scene_title']}</Text>
          <Text style={{
            fontSize: 0.3,
            width: 4,
            layoutOrigin: [0.5, 0.5],
            transform: [{translate: [0, 1.5, -3]}]
          }}
          >{this.state.current_scene['scene_location']}</Text>
          <Text style={{
            fontSize: 0.2,
            width: 4,
            layoutOrigin: [0.5, 0.5],
            transform: [{translate: [0, .75, -3]}]
          }}
          >{this.state.current_scene['scene_description']}</Text>
        </View>
        {this.state.current_scene['navigations'].map(function(item,i){
            return <Mesh key={i}
                         style={{
                           layoutOrigin: [0.5, 0.5],
                           transform: [{translate: item['translate']},
                                       {rotateX: item['rotation'][0]},
                                       {rotateY: item['rotation'][1]},
                                       {rotateZ: item['rotation'][2]}]
                         }}
                         onInput={ e => that.onNavigationClick(item,e)}>
                           <VrButton
                             style={{ width: 0.15,
                                      height:0.15,
                                      borderRadius: 50,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      borderStyle: 'solid',
                                      borderColor: '#FFFFFF80',
                                      borderWidth: 0.01
                             }}>
                             <VrButton
                               style={{ width: that.state.animationWidth,
                                        height:that.state.animationWidth,
                                        borderRadius: that.state.animationRadius,
                                        backgroundColor: '#FFFFFFD9'
                             }}>
                             </VrButton>
                           </VrButton>
                    </Mesh>
          })}
      </View>
    );
  }
};

AppRegistry.registerComponent('IALBlackHistoryMonth', () => IALBlackHistoryMonth);
