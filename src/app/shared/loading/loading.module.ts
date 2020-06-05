import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from './loading.component';
import {MaterialModule} from '../../material/material.module';

@NgModule({
    imports:[
        CommonModule,
        MaterialModule
    ],
    declarations:[LoadingComponent],
    providers:[],
    exports:[LoadingComponent]
})

export class LoadingModule{}