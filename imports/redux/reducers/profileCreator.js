/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import deepChange from 'updeep';

const DEFAULT_STATE = {
    question_1: {
        complete: false,
        question: '안녕하세요! 이름이 어떻게 되시나요?',
        inputs: [
            {
                value: '',
                required: true,
                key: '1-name',
                label: '',
                placeholder: '박보검',
                type: 'string',
                errors: [
                    {   type: 'isEmpty',
                        message: '이름은 필수입니다'
                    },
                    {   type: 'isNotString',
                        message: '허용되지 않은 값입니다'
                    }
                ]
            }
        ]
    },
    question_2: {
        complete: false,
        question: '반갑습니다 **data.name**님, 생일이 어떻게되시나요?',
        inputs: [
            {
                value: '',
                required: true,
                key: '2-birthday',
                label: '',
                placeholder: 'YYYY/MM/DD',
                type: 'string',
                errors: [
                    {   type: 'isEmpty',
                        message: '생일은 필수입니다'
                    },
                    {   type: 'isNotDate',
                        message: '날짜 값이 아닙니다'
                    }
                ]
            }
        ],
    },
    question_3: {
        complete: false,
        question: '몸 형태를 골라주세요',
        inputs: [
            {
                value: '',
                required: true,
                key: '3-bodyType',
                label: '',
                type: 'select-single',
                options: [
                    {
                        id: 'opt1',
                        type: 'image',
                        src: ''
                    },
                    {
                        id: 'opt2',
                        type: 'image',
                        src: ''
                    },
                    {
                        id: 'opt3',
                        type: 'image',
                        src: ''
                    },
                    {
                        id: 'opt4',
                        type: 'image',
                        src: ''
                    }
                ],
                errors: [
                    {   type: 'isEmpty',
                        message: '몸 형태는 필수입니다'
                    }
                ]
            }
        ],
    },
    question_4: {
        complete: false,
        question: '몸 형태를 골라주세요',
        inputs: [
            {
                value:[],
                required: true,
                key: '4-modelType',
                label: '',
                type: 'select-multi',
                options: [
                    {
                        id: 'opt1',
                        type: 'image',
                        src: ''
                    },
                    {
                        id: 'opt2',
                        type: 'image',
                        src: ''
                    },
                    {
                        id: 'opt3',
                        type: 'image',
                        src: ''
                    },
                    {
                        id: 'opt4',
                        type: 'image',
                        src: ''
                    }
                ],
                errors: [
                    {   type: 'isEmpty',
                        message: '몸 형태는 필수입니다'
                    }
                ]
            }
        ],
    }
};

function selection(state = DEFAULT_STATE, action) {

    switch (action.type) {

        case types.PROFILE_CREATOR_MODIFY: {
            return deepChange(action.value, state);
        }

        case types.PROFILE_CREATOR_ADD: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.game[action.key] = action.obj;
            return newState;
        }

        case types.PROFILE_CREATOR_REMOVE: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.game[action.path] = action.data;
            console.log("ACTION CHECK", action, newState);
            return newState;
        }

        default:
            return state;
    }
}

export default selection;
