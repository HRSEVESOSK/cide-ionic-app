import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  oib:boolean=false;
  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
    if (terms.match(/^[0-9]*$/)){
      this.oib = true;
      terms = terms;
    }
    else{
      this.oib= false;
      terms = terms.toLowerCase();
    }
    return items.filter( it => {
      if(this.oib){
        return it.oib.includes(terms); // only filter country name
      }
      else{
        return it.establishment_name.toLowerCase().includes(terms);
      }

    });
  }
}
