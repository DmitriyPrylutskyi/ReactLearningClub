import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { createStore } from "redux";
//import { router } from "./router.js";

const initialQuestions = {
  step: 0,
  questions: [
    {
      title: 'Типы деятельности вашей компании',
      answers: [
        {title: 'Грузоотправитель'},
        {title: 'Грузополучатель'},
        {title: 'Экспедитор'},
      ],
    },
    {
      title: 'Объём грузоперевозок вашей компании',
      answers: [
        {title: 'До 100 вагонов'},
        {title: 'От 100 до 500 вагонов'},
        {title: 'От 500 вагонов'},
      ],
    },
    {
      title: 'Оборот вашей компании',
      answers: [
        {title: 'До 100 000 рублей'},
        {title: 'От 100 000 до 500 000 рублей'},
        {title: 'От 500 000 рублей'},
      ],
    },
  ],
  checked: {
    0: {
      0: false,
      1: true,
      2: false,
    },
    1: {
      0: false,
      1: false,
      2: false,
    },
    2: {
      0: true,
      1: false,
      2: false,
    },
  }
};

const nextQuestion = (count = 1) => {
  return {
    type: 'NEXT_QUESTION',
    payload: {
      add: count
    }
  }
};

//Reducers
const info = (state = initialQuestions, action) => {
  switch (action.type) {
    case 'NEXT_QUESTION':
      const nextstep = state.step + action.payload.add
      if(nextstep > state.questions.length-1) {
        return {
          ...state,
          step: state.questions.length-1
        }
      }
      if (nextstep < 0) {
        return {
          ...state,
          step: 0
        }
      }
      return {
        ...state,
        step: state.step + action.payload.add
      };
    default:
      return state;
  };
};

const myStore = createStore(info);

class Master extends React.Component {
  render() {
    const { info: {step, questions, checked}, nextQuestion } = this.props;
    const { answers, title } = questions[step];
    return (
      <div>
        <h2>{title}</h2>
        <ul>
          {
            answers.map((item, key) => {
              return (
                <li key={key}>
                  {item.title}
                </li>
              );
            })
          }
        </ul>
        <button onClick={nextQuestion.bind(this, -1)}>
          Prev
        </button>
        <button onClick={nextQuestion.bind(this, 1)}>
          Next
        </button>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    info: state
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    nextQuestion: (count = 1) => dispatch(nextQuestion(count)),
  };
};

const MasterContainer = connect(mapStateToProps, mapDispatchToProps)(Master);

class App extends React.Component {
  render() {
    return (
      <Provider store={myStore} >
        <MasterContainer />
      </Provider>
    );
  }
};

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
