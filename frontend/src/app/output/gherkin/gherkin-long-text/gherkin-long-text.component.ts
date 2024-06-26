import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gherkin-long-text',
  templateUrl: './gherkin-long-text.component.html',
  styleUrls: ['./gherkin-long-text.component.scss']
})
export class GherkinLongTextComponent implements OnInit {
  @Input() longText: string;
  @Input() longTextType: string | undefined;

  isJson: boolean;

  /* eslint-disable-next-line @typescript-eslint/ban-types */
  json: object;

  rawJson: string;

  constructor() {}

  ngOnInit() {
    try {
      this.json = JSON.parse(this.longText);
      this.isJson = true;
      this.rawJson = JSON.stringify(this.json, undefined, 2);
    } catch (e) {
      this.isJson = false;
    }
  }
}
