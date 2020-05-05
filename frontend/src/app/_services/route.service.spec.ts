import {TestBed} from '@angular/core/testing';

import {RouteService} from "./route.service";
import {MenuPageHierarchy, MenuType} from "../_models/menu";

describe('RouteService', () => {
    let service: RouteService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.get(RouteService);
    });

    it('navigationParamsToNavigationRoute focus on nodes', () => {
        expect(service.navigationParamsToNavigationRoute({nodes: "_publisher"}).nodes).toEqual(["publisher"]);
        expect(service.navigationParamsToNavigationRoute({nodes: "publisher"}).nodes).toEqual(["publisher"]);
        expect(service.navigationParamsToNavigationRoute({nodes: "_publisher_"}).nodes).toEqual(["publisher"]);
        expect(service.navigationParamsToNavigationRoute({nodes: "_publisher_systems"}).nodes).toEqual(["publisher", "systems"]);
        expect(service.navigationParamsToNavigationRoute({nodes: "_publisher_systems_services"}).nodes).toEqual(["publisher", "systems", "services"]);
    });

    it('navigationParamsToNavigationRoute focus on project', () => {
        expect(service.navigationParamsToNavigationRoute({project: "ecs"}).project).toEqual("ecs");
    });

    it('navigationParamsToNavigationRoute focus on branch', () => {
        expect(service.navigationParamsToNavigationRoute({branch: ""}).branch).toEqual("_");
        expect(service.navigationParamsToNavigationRoute({branch: "_"}).branch).toEqual("_");
        expect(service.navigationParamsToNavigationRoute({branch: "feature_153.categories"}).branch).toEqual("feature/153_categories");

    });

    it('navigationParamsToNavigationRoute focus on directories', () => {
        expect(service.navigationParamsToNavigationRoute({directories: ""}).directories).toEqual([]);
        expect(service.navigationParamsToNavigationRoute({directories: "_"}).directories).toEqual([]);
        expect(service.navigationParamsToNavigationRoute({directories: "__"}).directories).toEqual([]);
        expect(service.navigationParamsToNavigationRoute({directories: "_Features"}).directories).toEqual(["Features"]);
        expect(service.navigationParamsToNavigationRoute({directories: "_Features_Categories"}).directories).toEqual(["Features", "Categories"]);
        expect(service.navigationParamsToNavigationRoute({directories: "__Features_Categories"}).directories).toEqual(["Features", "Categories"]);
    });

    it('navigationParamsToNavigationRoute focus on page', () => {
        expect(service.navigationParamsToNavigationRoute({page: "Model"}).page).toEqual("Model");
    });

    it('navigationRouteToFrontendPath ', () => {
        const navigationRoute = {
            nodes: ["publisher", "systems", "services"],
            project: "ecs",
            branch: "_",
            directories: ["Features", "Categories"],
            page: "Model"
        };
        expect(service.navigationRouteToFrontEndPath(navigationRoute).pathFromNodes).toEqual("_publisher_systems_services/ecs/_/_Features_Categories/Model");
        expect(service.navigationRouteToFrontEndPath(navigationRoute).nodesPath).toEqual("_publisher_systems_services");
    });

    it('navigationRouteToFrontendPath focus on branch', () => {
        expect(service.navigationRouteToFrontEndPath({branch: "feature/153_categories"}).pathFromNodes).toEqual("/_/feature_153.categories/_");
    });

    it('navigationRouteToBackEndPath ', () => {
        const navigationRoute = {
            nodes: ["publisher", "systems", "services"],
            project: "ecs",
            branch: "_",
            directories: ["Features", "Categories"],
            page: "Model"
        };
        expect(service.navigationRouteToBackEndPath(navigationRoute).pathFromProject).toEqual("ecs>>/Features/Categories/Model");
    });

    it('navigationParamsToFrontEndPath ', () => {
        const navigationParams = {
            nodes: "_publisher_systems_services",
            project: "ecs",
            branch: "_",
            directories: "_Features_Categories",
            page: "Model"
        };

        expect(service.navigationParamsToFrontEndPath(navigationParams).nodesPath).toEqual("_publisher_systems_services");
        expect(service.navigationParamsToFrontEndPath(navigationParams).pathFromNodes).toEqual("_publisher_systems_services/ecs/_/_Features_Categories/Model");
    });

    it('backEndPathToNavigationRoute focus on directory', () => {
        expect(service.backEndPathToNavigationRoute("publisherSystems>>/")).toEqual({ project: "publisherSystems", branch: "_", directories: []  });
        expect(service.backEndPathToNavigationRoute("publisherData>>/Public/")).toEqual({ project: "publisherData", branch: "_", directories: ["Public"]  });
    });

    it('menuHierarchyToFrontEndPath focus on node without a directory ', () => {
        const menuHierarchy = {
            type: 'Node' as MenuType,
            children: [] as MenuPageHierarchy[],
            name:"publisher",
            label:"Publisher",
            depth:0,
            route: {
                nodes: ["publisher"]
            }
        };
        expect(service.menuHierarchyToFrontEndPath(menuHierarchy).pathFromNodes).toEqual("_publisher/_/_/_");
    });

    it('menuHierarchyToFrontEndPath focus on node with a directory ', () => {
        const menuHierarchy = {
            type: 'Node' as MenuType,
            children: [
                {
                    type: 'Page' as MenuType,
                    depth:1,
                    description:"",
                    label:"",
                    name:"",
                    order:0,
                    route: {
                        nodes: ["publisher"],
                        project: "publisherSystems",
                        branch: "_",
                        directories: [""],
                        page: "Services"
                    },
                    children: [] as MenuPageHierarchy[]
                }
            ],

            name:"publisher",
            label:"Publisher",
            directory:"publisherSystems>>/",
            depth:0,
            route: {
                nodes: ["publisher"]
            }
        };
        expect(service.menuHierarchyToFrontEndPath(menuHierarchy).pathFromNodes).toEqual("_publisher/publisherSystems/_/_/Services");
    });

    it('legacyFullFrontEndUrlToFullFrontEndUrl ', () => {
        expect(RouteService.legacyFullFrontEndUrlToFullFrontEndUrl("app/documentation/navigate/_publisher;path=shoppingApiPublic%3E%3E_Features_Feeds_/Feature")).toEqual("app/documentation/navigate/_publisher/shoppingApiPublic/_/_Features_Feeds/Feature");
        expect(RouteService.legacyFullFrontEndUrlToFullFrontEndUrl("app/documentation/navigate/_publisher;path=shoppingApiPublic>>_Features_Feeds_/Feature")).toEqual("app/documentation/navigate/_publisher/shoppingApiPublic/_/_Features_Feeds/Feature");
        expect(RouteService.legacyFullFrontEndUrlToFullFrontEndUrl("app/documentation/navigate/_publisher;path=shoppingApiPublic>qa>_Features_Feeds_/Feature")).toEqual("app/documentation/navigate/_publisher/shoppingApiPublic/qa/_Features_Feeds/Feature");
        expect(RouteService.legacyFullFrontEndUrlToFullFrontEndUrl("app/documentation/navigate/_publisher;path=shoppingApiPublic>qa>_/Feature")).toEqual("app/documentation/navigate/_publisher/shoppingApiPublic/qa/_/Feature");
        expect(RouteService.legacyFullFrontEndUrlToFullFrontEndUrl("app/documentation/navigate/_publisher;path=shoppingApiPublic%3Eqa%3E_/Feature")).toEqual("app/documentation/navigate/_publisher/shoppingApiPublic/qa/_/Feature");
    });

    it('legacyFullFrontEndUrlToFullFrontEndUrl do not touch current pattern', () => {
        expect(RouteService.legacyFullFrontEndUrlToFullFrontEndUrl("app/documentation/navigate/_publisher/publisherSystems/_/_/Services")).toEqual("app/documentation/navigate/_publisher/publisherSystems/_/_/Services");
    });

    it('relativeUrlToFullFrontEndUrl ', () => {
        expect(service.relativeUrlToFullFrontEndUrl('./OpenApi',{nodes: 'Tools',project: 'theGardener',branch: 'master',directories: '_Guide_Write',page: 'Basics'} ))
               .toEqual("app/documentation/navigate/Tools/theGardener/master/_Guide_Write/OpenApi");
        expect(service.relativeUrlToFullFrontEndUrl('../Guides',{nodes: 'Tools',project: 'theGardener',branch: 'master',directories: '_Guide_Write',page: 'Basics'} ))
               .toEqual("app/documentation/navigate/Tools/theGardener/master/_Guide/Guides");
        expect(service.relativeUrlToFullFrontEndUrl('../../Changelog',{nodes: 'Tools',project: 'theGardener',branch: 'master',directories: '_Guide_Write',page: 'Basics'} ))
            .toEqual("app/documentation/navigate/Tools/theGardener/master/_/Changelog");
        expect(service.relativeUrlToFullFrontEndUrl('../../Features/Projects/Model',{nodes: 'Tools',project: 'theGardener',branch: 'master',directories: '_Guide_Write',page: 'Basics'} ))
            .toEqual("app/documentation/navigate/Tools/theGardener/master/_Features_Projects/Model");

        expect(service.relativeUrlToFullFrontEndUrl('../../../Features/Projects/Model',{nodes: 'Tools',project: 'theGardener',branch: 'master',directories: '_Guide_Write',page: 'Basics'} ))
            .toEqual(undefined);

    });

    it('selectBranchFromNavigationRoute ', () => {
        expect(service.selectBranchFromNavigationRoute({ branch: "_"  },"qa")).toEqual("qa");
        expect(service.selectBranchFromNavigationRoute({ branch: "qa"  },"qa")).toEqual("qa");
        expect(service.selectBranchFromNavigationRoute({ branch: "master"  },"qa")).toEqual("master");
    });

    it('directoryPathSimilar ', () => {
        const navigationRoute = { nodes: ["publisher"], project: "ecs",  branch: "_",  directories: [] as  Array<string>,  page: "Meta"  };

        expect(service.directoryPathSimilar(navigationRoute, { nodes: ["publisher"], project: "ecs",  branch: "_",  directories: [] as  Array<string>,  page: "Meta"  })).toBeTrue();
        expect(service.directoryPathSimilar(navigationRoute, { nodes: ["publisher"], project: "ecs",  branch: "master",  directories: [] as  Array<string>,  page: "Meta"  })).toBeTrue();
    });


    it('pagePathSimilar ', () => {
        const navigationRoute = { nodes: ["publisher"], project: "ecs",  branch: "_",  directories: [] as  Array<string>,  page: "Meta"  };

        expect(service.pagePathSimilar(navigationRoute, { nodes: ["publisher"], project: "ecs",  branch: "_",  directories: [] as  Array<string>,  page: "Meta"  })).toBeTrue();
        expect(service.pagePathSimilar(navigationRoute, { nodes: ["publisher"], project: "ecs",  branch: "qa",  directories: [] as  Array<string>,  page: "Meta"  })).toBeTrue();
        expect(service.pagePathSimilar(navigationRoute, { nodes: ["publisher"], project: "ecs",  branch: "documentation",  directories: [] as  Array<string>,  page: "Meta"  })).toBeTrue();
        expect(service.pagePathSimilar(navigationRoute, { nodes: ["publisher"], project: "ls",  branch: "_",  directories: [] as  Array<string>,  page: "Meta"  })).toBeFalse();
        expect(service.pagePathSimilar(navigationRoute, { nodes: ["publisher","systems"], project: "ls",  branch: "_",  directories: [] as  Array<string>,  page: "Meta"  })).toBeFalse();
    });

    it('should transform relative path to clean URL', () => {
        expect(service.relativePathToUrl('/features/foo/bar')).toEqual('_features_foo_bar');
        expect(service.relativePathToUrl('/features/foo_foo/bar')).toEqual('_features_foo.foo_bar');
    });

    it('should transform URL to relative path', () => {
        expect(service.urlToRelativePath('_features_foo_bar')).toEqual('/features/foo/bar');
        expect(service.urlToRelativePath('_features_foo.foo_bar')).toEqual('/features/foo_foo/bar');
    });
});