import * as React from "react";
import { Page } from "./components/layout/Page";
import { Footer } from "./components/layout/Footer";
import { Metrics } from "./components/Metrics";
import { Releases } from "./components/Releases";
import { Header } from "./components/layout/Header";
import { ChartGraphics } from "./page";
import { ReleaseYear, MetricsContext, Config } from "../model";

export const Report: React.FC<{
  releasesMap: Map<string, number>;
  graphics: ChartGraphics;
  releases: ReleaseYear;
  context: MetricsContext;
  config: Config;
}> = ({ releasesMap, graphics, releases, context, config }) => (
  <Page>
    <Header year={releases} repo={context.repo} owner={context.owner} />
    <Releases year={releases} releasesMap={releasesMap} />
    <Metrics config={config} graphics={graphics} />
    <Footer />
  </Page>
);
