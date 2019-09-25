Feature: Compute in background all pages on the synchronization step to serve them from a cache


  Background:
    Given No project is checkout
    And the database is empty
    And the cache is empty


  @level_1_specification @nominal_case @valid @documentation
  Scenario: Synchronize the features of a project with a webhook
    Given we have the following projects
      | id            | name                    | repositoryUrl                                  | stableBranch | featuresRootPath |
      | suggestionsWS | Suggestions WebServices | target/data/GetFeatures/library/suggestionsWS/ | master       | test/features    |
    And the server "target/data/GetFeatures" host under the project "library/suggestionsWS" on the branch "master" the file "test/features/provide_book_suggestions.feature"
"""
Feature: As a user, I want some book suggestions so that I can do some discovery
    """
    When the synchronization action is triggered by the webhook for project "suggestionsWS"
    Then the file system store now the file "target/data/git/suggestionsWS/master/test/features/provide_book_suggestions.feature"
"""
Feature: As a user, I want some book suggestions so that I can do some discovery
    """

  @level_1_specification @nominal_case @valid @documentation
  Scenario: Synchronize the features of all the projects with a scheduler
    Given we have the following configuration
      | path                               | value |
      | projects.synchronize.interval      | 60    |
      | projects.synchronize.initial.delay | 1     |
    And we have the following projects
      | id            | name                    | repositoryUrl                                  | stableBranch | featuresRootPath |
      | suggestionsWS | Suggestions WebServices | target/data/GetFeatures/library/suggestionsWS/ | master       | test/features    |
    And the server "target/data/GetFeatures" host under the project "library/suggestionsWS" on the branch "master" the file "test/features/provide_book_suggestions.feature"
"""
Feature: As a user, I want some book suggestions so that I can do some discovery
    """
    When BDD features synchronization action is triggered
    Then the file system store now the file "target/data/git/suggestionsWS/master/test/features/provide_book_suggestions.feature"
"""
Feature: As a user, I want some book suggestions so that I can do some discovery
    """

  @level_1_specification @limit_case @valid
  Scenario: Synchronize the features of a project with a webhook - the local directory of the branch has been removed
    Given we have the following projects
      | id            | name                    | repositoryUrl                                  | stableBranch | featuresRootPath |
      | suggestionsWS | Suggestions WebServices | target/data/GetFeatures/library/suggestionsWS/ | master       | test/features    |
    And we have those branches in the database
      | id | name   | isStable | projectId     |
      | 1  | master | true     | suggestionsWS |
    And the server "target/data/GetFeatures" host under the project "library/suggestionsWS" on the branch "master" the file "test/features/provide_book_suggestions.feature"
"""
Feature: As a user, I want some book suggestions so that I can do some discovery
    """
    When the synchronization action is triggered by the webhook for project "suggestionsWS"
    Then the file system store now the file "target/data/git/suggestionsWS/master/test/features/provide_book_suggestions.feature"
"""
Feature: As a user, I want some book suggestions so that I can do some discovery
    """
